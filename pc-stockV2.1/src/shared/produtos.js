import { createProduto, getProdutoById, getProdutos, patchProduto } from './api.js';
import { getCurrentUser } from './auth.js';
import { animateSavedProduct, bindProductTableFilter } from './jquery-features.js';
import {
  escapeHTML,
  formatCurrency,
  formatDateBR,
  getTodayLocalISO,
  qs,
  setHTML,
  showToast
} from './utils.js';

const LAST_PRODUCT_KEY = 'pcstock_ultimo_produto';

class Produto {
  constructor({ usuarioId, nome, modelo, tipo, especificacoesTecnicas, informacoesAdicionais, valorVenda }) {
    this.usuarioId = usuarioId;
    this.nome = nome;
    this.modelo = modelo;
    this.tipo = tipo;
    this.especificacoes_tecnicas = especificacoesTecnicas;
    this.informacoes_adicionais = informacoesAdicionais;
    this.valor_venda = valorVenda;
    this.quantidade_estoque = 0;
    this.quantidade_cadastro = 0;
    this.data_cadastro = getTodayLocalISO();
    this.createdAt = new Date().toISOString();
    this.ativo = true;
  }
}

function getProdutoStatus(produto) {
  if (produto.quantidade_estoque <= 0) {
    return { label: 'Zerado', className: 'out-stock' };
  }
  if (produto.quantidade_estoque <= 5) {
    return { label: 'Estoque baixo', className: 'low-stock' };
  }
  return { label: 'Em estoque', className: 'in-stock' };
}
export async function initPainelPage() {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const produtos = (await getProdutos(user.id)).filter((item) => item.ativo !== false);
    renderResumo(produtos);
    renderTabela(produtos);
    bindDeleteButtons(produtos);
    bindProductTableFilter();
  } catch (error) {
    console.error(error);
    setHTML('produtos-table', '<div class="empty-state">Não foi possível carregar os produtos.</div>');
  }
}
function renderResumo(produtos) {
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
function renderTabela(produtos) {
  if (produtos.length === 0) {
    setHTML('produtos-table', '<div class="empty-state">Nenhum produto cadastrado até o momento.</div>');
    return;
  }
  const rows = produtos
    .map((produto) => {
      const status = getProdutoStatus(produto);
      const canDelete = produto.quantidade_estoque === 0;
      const searchText = `${produto.nome} ${produto.modelo} ${produto.tipo}`.toLocaleLowerCase('pt-BR');
      return `
        <tr data-product-row data-search="${escapeHTML(searchText)}">
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
              <a class="btn btn-sm btn-outline-info" href="../new-product/?id=${produto.id}" title="Editar produto">
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
      <p class="table-scroll-note">Arraste a tabela para o lado para ver todas as informações.</p>
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
      <div id="filtro-produtos-vazio" class="empty-state d-none mt-3">
        Nenhum produto corresponde ao filtro.
      </div>
    `
  );
}
function bindDeleteButtons(produtos) {
  document.querySelectorAll('[data-delete-id]').forEach((button) => {
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

function saveLastProduct(product, serverSaved) {
  localStorage.setItem(
    LAST_PRODUCT_KEY,
    JSON.stringify({
      product,
      serverSaved,
      savedAt: new Date().toISOString()
    })
  );
}

function loadLastProduct() {
  const raw = localStorage.getItem(LAST_PRODUCT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function renderSavedProduct(record = loadLastProduct()) {
  const target = document.getElementById('produto-resultado-conteudo');
  if (!target || !record?.product) return;
  const product = record.product;
  target.innerHTML = `
    <div class="row g-3">
      <div class="col-md-6"><strong>Nome:</strong> ${escapeHTML(String(product.nome || '—'))}</div>
      <div class="col-md-6"><strong>Modelo:</strong> ${escapeHTML(String(product.modelo || '—'))}</div>
      <div class="col-md-6"><strong>Tipo:</strong> ${escapeHTML(String(product.tipo || '—'))}</div>
      <div class="col-md-6"><strong>Valor:</strong> ${formatCurrency(product.valor_venda)}</div>
      <div class="col-12">
        <strong>Persistência:</strong>
        <span class="${record.serverSaved ? 'text-success' : 'text-warning'}">
          ${record.serverSaved ? 'salvo no localStorage e no JSON Server' : 'salvo somente no localStorage'}
        </span>
      </div>
    </div>
  `;
  animateSavedProduct();
}

export async function initNovoProdutoPage() {
  const user = getCurrentUser();
  if (!user) return;
  const form = document.querySelector('#produto-form');
  if (!form) return;
  const pageTitle = document.querySelector('.app-topbar h2');
  const sectionTitle = document.querySelector('#produto-card h3');
  const sectionNote = document.querySelector('#produto-card .page-note');
  const submitButton = form.querySelector('button[type="submit"]');
  const url = new URL(window.location.href);
  const editingId = Number(url.searchParams.get('id'));
  const isEditing = Number.isFinite(editingId) && editingId > 0;
  let produtoAtual = null;
  renderSavedProduct();

  document.getElementById('limpar-produto')?.addEventListener('click', () => {
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.value = '';
      field.setCustomValidity('');
    });
    form.classList.remove('was-validated');
    qs('#nome').focus();
    showToast('Campos do produto foram limpos.');
  });

  if (isEditing) {
    try {
      const produto = await getProdutoById(editingId);
      if (!produto || produto.usuarioId !== user.id) {
        showToast('Produto não encontrado para edição.', 'error');
        window.location.href = '../dashboard/';
        return;
      }
      produtoAtual = produto;
      qs('#nome').value = produto.nome;
      qs('#modelo').value = produto.modelo;
      qs('#tipo').value = produto.tipo;
      qs('#valor_venda').value = String(produto.valor_venda ?? '');
      qs('#especificacoes_tecnicas').value = produto.especificacoes_tecnicas;
      qs('#informacoes_adicionais').value = produto.informacoes_adicionais;
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
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      form.reportValidity();
      showToast('Corrija os campos destacados antes de salvar.', 'error');
      return;
    }

    const produto = new Produto({
      usuarioId: user.id,
      nome: qs('#nome').value.trim(),
      modelo: qs('#modelo').value.trim(),
      tipo: qs('#tipo').value.trim(),
      especificacoesTecnicas: qs('#especificacoes_tecnicas').value.trim(),
      informacoesAdicionais: qs('#informacoes_adicionais').value.trim(),
      valorVenda: Number(qs('#valor_venda').value)
    });

    try {
      if (produtoAtual) {
        await patchProduto(produtoAtual.id, {
          nome: produto.nome,
          modelo: produto.modelo,
          tipo: produto.tipo,
          especificacoes_tecnicas: produto.especificacoes_tecnicas,
          informacoes_adicionais: produto.informacoes_adicionais,
          valor_venda: produto.valor_venda
        });
        showToast('Produto atualizado com sucesso.');
        window.setTimeout(() => {
          window.location.href = '../dashboard/';
        }, 450);
        return;
      }

      const savedProduct = await createProduto(produto);
      saveLastProduct(savedProduct, true);
      renderSavedProduct();
      showToast('Produto salvo no localStorage e no JSON Server.');
      form.reset();
      form.classList.remove('was-validated');
      qs('#nome').focus();
    } catch (error) {
      console.error(error);
      if (error.localProduct) {
        saveLastProduct(error.localProduct, false);
        renderSavedProduct();
        showToast(error.message, 'error');
        return;
      }
      showToast(
        produtoAtual ? 'Não foi possível atualizar o produto.' : 'Não foi possível cadastrar o produto.',
        'error'
      );
    }
  });
}
