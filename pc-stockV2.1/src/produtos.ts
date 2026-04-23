import { createProduto, getProdutoById, getProdutos, patchProduto, type Produto } from './api';
import { getCurrentUser } from './auth';
import {
  escapeHTML,
  formatCurrency,
  formatDateBR,
  getTodayLocalISO,
  qs,
  setHTML,
  showToast
} from './utils';

function getProdutoStatus(produto: Produto): { label: string; className: string } {
  if (produto.quantidade_estoque <= 0) {
    return { label: 'Zerado', className: 'out-stock' };
  }
  if (produto.quantidade_estoque <= 5) {
    return { label: 'Estoque baixo', className: 'low-stock' };
  }
  return { label: 'Em estoque', className: 'in-stock' };
}

export async function initPainelPage(): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const produtos = (await getProdutos(user.id)).filter((item) => item.ativo !== false);
    renderResumo(produtos);
    renderTabela(produtos);
    bindDeleteButtons(produtos);
  } catch (error) {
    console.error(error);
    setHTML('produtos-table', '<div class="empty-state">Não foi possível carregar os produtos.</div>');
  }
}

function renderResumo(produtos: Produto[]): void {
  const totalProdutos = produtos.length;
  const totalUnidades = produtos.reduce((sum, item) => sum + item.quantidade_estoque, 0);
  const valorEstimado = produtos.reduce((sum, item) => sum + item.quantidade_estoque * item.valor_venda, 0);

  setHTML(
    'dashboard-kpis',
    `
      <div class="col-12 col-md-4">
        <div class="summary-card">
          <div class="summary-label">Produtos cadastrados</div>
          <div class="summary-value">${totalProdutos}</div>
          <div class="text-secondary small">Itens ativos no inventário</div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="summary-card soft-cyan">
          <div class="summary-label">Unidades em estoque</div>
          <div class="summary-value">${totalUnidades}</div>
          <div class="text-secondary small">Soma de todas as quantidades</div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="summary-card soft-pink">
          <div class="summary-label">Valor estimado</div>
          <div class="summary-value" style="font-size: 1.7rem;">${formatCurrency(valorEstimado)}</div>
          <div class="text-secondary small">Baseado no valor de venda cadastrado</div>
        </div>
      </div>
    `
  );
}

function renderTabela(produtos: Produto[]): void {
  if (produtos.length === 0) {
    setHTML('produtos-table', '<div class="empty-state">Nenhum produto cadastrado até o momento.</div>');
    return;
  }

  const rows = produtos
    .map((produto) => {
      const status = getProdutoStatus(produto);
      const canDelete = produto.quantidade_estoque === 0;
      return `
        <tr>
          <td>
            <div class="fw-semibold">${escapeHTML(produto.nome)}</div>
            <div class="text-secondary small">${escapeHTML(produto.modelo || 'Sem modelo')}</div>
          </td>
          <td><span class="pill-sku">ID-${produto.id}</span></td>
          <td>${escapeHTML(produto.tipo || 'Sem tipo')}</td>
          <td class="fw-semibold">${produto.quantidade_estoque}</td>
          <td><span class="pill-status ${status.className}">${status.label}</span></td>
          <td>${formatCurrency(produto.valor_venda)}</td>
          <td>${formatDateBR(produto.data_cadastro)}</td>
          <td>
            <div class="d-flex flex-wrap gap-2">
              <a class="btn btn-sm btn-outline-info" href="/novo_produto.html?id=${produto.id}" title="Editar produto">
                Editar
              </a>
              <button
                class="btn btn-sm ${canDelete ? 'btn-outline-danger' : 'btn-outline-secondary'}"
                data-delete-id="${produto.id}"
                ${canDelete ? '' : 'disabled'}
                title="${canDelete ? 'Apagar produto zerado' : 'Só é possível apagar com estoque zerado'}"
              >
                Apagar
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  setHTML(
    'produtos-table',
    `
      <div class="table-responsive">
        <table class="table table-kinetic align-middle">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Identificação</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Status</th>
              <th>Valor venda</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `
  );
}

function bindDeleteButtons(produtos: Produto[]): void {
  document.querySelectorAll<HTMLButtonElement>('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.deleteId);
      const produto = produtos.find((item) => item.id === id);

      if (!produto) return;
      if (produto.quantidade_estoque !== 0) {
        showToast('Só é possível apagar produtos com estoque zerado.', 'error');
        return;
      }

      const confirmed = window.confirm(`Deseja apagar o produto "${produto.nome}" do inventário?`);
      if (!confirmed) return;

      try {
        await patchProduto(id, { ativo: false });
        showToast('Produto removido do inventário.');
        await initPainelPage();
      } catch (error) {
        console.error(error);
        showToast('Não foi possível apagar o produto.', 'error');
      }
    });
  });
}

export async function initNovoProdutoPage(): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  const form = document.getElementById('produto-form') as HTMLFormElement | null;
  if (!form) return;

  const pageTitle = document.querySelector('.app-topbar h2');
  const sectionTitle = document.querySelector('.form-card h3');
  const sectionNote = document.querySelector('.form-card .page-note');
  const submitButton = form.querySelector('button[type="submit"]');
  const url = new URL(window.location.href);
  const editingId = Number(url.searchParams.get('id'));
  const isEditing = Number.isFinite(editingId) && editingId > 0;

  let produtoAtual: Produto | null = null;

  if (isEditing) {
    try {
      const produto = await getProdutoById(editingId);
      if (!produto || produto.usuarioId !== user.id) {
        showToast('Produto não encontrado para edição.', 'error');
        window.location.href = '/painel.html';
        return;
      }

      produtoAtual = produto;
      qs<HTMLInputElement>('#nome').value = produto.nome;
      qs<HTMLInputElement>('#modelo').value = produto.modelo;
      qs<HTMLInputElement>('#tipo').value = produto.tipo;
      qs<HTMLInputElement>('#valor_venda').value = String(produto.valor_venda ?? '');
      qs<HTMLTextAreaElement>('#especificacoes_tecnicas').value = produto.especificacoes_tecnicas;
      qs<HTMLTextAreaElement>('#informacoes_adicionais').value = produto.informacoes_adicionais;

      if (pageTitle) pageTitle.textContent = 'Editar Produto';
      if (sectionTitle) sectionTitle.textContent = 'Editar produto';
      if (sectionNote) {
        sectionNote.textContent = `Altere os dados do produto. O estoque atual deste item é ${produto.quantidade_estoque}.`;
      }
      if (submitButton) submitButton.textContent = 'Salvar alterações';
      document.title = 'PC-Stock | Editar Produto';
    } catch (error) {
      console.error(error);
      showToast('Não foi possível carregar o produto para edição.', 'error');
      return;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      usuarioId: user.id,
      nome: qs<HTMLInputElement>('#nome').value.trim(),
      modelo: qs<HTMLInputElement>('#modelo').value.trim(),
      tipo: qs<HTMLInputElement>('#tipo').value.trim(),
      especificacoes_tecnicas: qs<HTMLTextAreaElement>('#especificacoes_tecnicas').value.trim(),
      informacoes_adicionais: qs<HTMLTextAreaElement>('#informacoes_adicionais').value.trim(),
      valor_venda: Number(qs<HTMLInputElement>('#valor_venda').value || 0)
    };

    if (!payload.nome) {
      showToast('Informe pelo menos o nome do produto.', 'error');
      return;
    }

    try {
      if (produtoAtual) {
        await patchProduto(produtoAtual.id, {
          nome: payload.nome,
          modelo: payload.modelo,
          tipo: payload.tipo,
          especificacoes_tecnicas: payload.especificacoes_tecnicas,
          informacoes_adicionais: payload.informacoes_adicionais,
          valor_venda: payload.valor_venda
        });
        showToast('Produto atualizado com sucesso.');
        window.setTimeout(() => {
          window.location.href = '/painel.html';
        }, 450);
        return;
      }

      await createProduto({
        ...payload,
        quantidade_estoque: 0,
        data_cadastro: getTodayLocalISO(),
        ativo: true
      });
      showToast('Produto cadastrado com sucesso.');
      form.reset();
    } catch (error) {
      console.error(error);
      showToast(produtoAtual ? 'Não foi possível atualizar o produto.' : 'Não foi possível cadastrar o produto.', 'error');
    }
  });
}
