import { createEntrada, createSaida, getProdutos, patchProduto, type Produto } from './api';
import { getCurrentUser } from './auth';
import { getTodayLocalISO, qs, showToast } from './utils';

async function loadProdutosAtivos(): Promise<Produto[]> {
  const user = getCurrentUser();
  if (!user) return [];
  const produtos = await getProdutos(user.id);
  return produtos.filter((item) => item.ativo !== false);
}

function renderProdutoOptions(select: HTMLSelectElement, produtos: Produto[]): void {
  select.innerHTML = `
    <option value="">Selecione um produto</option>
    ${produtos
      .map((produto) => `<option value="${produto.id}">${produto.nome} - ${produto.modelo || 'Sem modelo'}</option>`)
      .join('')}
  `;
}

export async function initEntradaPage(): Promise<void> {
  const form = document.getElementById('entrada-form') as HTMLFormElement | null;
  const select = document.getElementById('produto_id_entrada') as HTMLSelectElement | null;
  const dateInput = document.getElementById('data_entrada') as HTMLInputElement | null;

  if (!form || !select || !dateInput) return;

  dateInput.value = getTodayLocalISO();

  try {
    let produtos = await loadProdutosAtivos();
    renderProdutoOptions(select, produtos);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      produtos = await loadProdutosAtivos();
      const produtoId = Number(select.value);
      const quantidade = Number(qs<HTMLInputElement>('#quantidade_entrada').value);
      const valorUnitario = Number(qs<HTMLInputElement>('#valor_unitario_entrada').value || 0);
      const data = qs<HTMLInputElement>('#data_entrada').value;

      const produto = produtos.find((item) => item.id === produtoId);
      if (!produto) {
        showToast('Selecione um produto válido.', 'error');
        return;
      }

      if (quantidade <= 0) {
        showToast('A quantidade de entrada deve ser maior que zero.', 'error');
        return;
      }

      await createEntrada({
        produtoId,
        quantidade,
        valor_unitario: valorUnitario,
        lote: qs<HTMLInputElement>('#lote').value.trim(),
        remetente: qs<HTMLInputElement>('#remetente').value.trim(),
        distribuidor: qs<HTMLInputElement>('#distribuidor').value.trim(),
        data
      });

      await patchProduto(produto.id, {
        quantidade_estoque: produto.quantidade_estoque + quantidade
      });

      showToast('Entrada registrada com sucesso.');
      form.reset();
      dateInput.value = getTodayLocalISO();
      produtos = await loadProdutosAtivos();
      renderProdutoOptions(select, produtos);
    });
  } catch (error) {
    console.error(error);
    showToast('Não foi possível carregar os produtos para entrada.', 'error');
  }
}

export async function initSaidaPage(): Promise<void> {
  const form = document.getElementById('saida-form') as HTMLFormElement | null;
  const select = document.getElementById('produto_id_saida') as HTMLSelectElement | null;
  const dateInput = document.getElementById('data_saida') as HTMLInputElement | null;
  const stockHint = document.getElementById('estoque-disponivel');

  if (!form || !select || !dateInput) return;

  dateInput.value = getTodayLocalISO();

  try {
    let produtos = await loadProdutosAtivos();
    renderProdutoOptions(select, produtos);

    const updateStockHint = () => {
      const produto = produtos.find((item) => item.id === Number(select.value));
      if (stockHint) {
        stockHint.textContent = produto
          ? `Estoque disponível: ${produto.quantidade_estoque}`
          : 'Selecione um produto para ver o estoque disponível.';
      }
    };

    select.addEventListener('change', updateStockHint);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      produtos = await loadProdutosAtivos();
      const produtoId = Number(select.value);
      const quantidade = Number(qs<HTMLInputElement>('#quantidade_saida').value);
      const valorUnitarioInput = qs<HTMLInputElement>('#valor_unitario_saida').value;
      const data = qs<HTMLInputElement>('#data_saida').value;

      const produto = produtos.find((item) => item.id === produtoId);
      if (!produto) {
        showToast('Selecione um produto válido.', 'error');
        return;
      }

      if (quantidade <= 0) {
        showToast('A quantidade de saída deve ser maior que zero.', 'error');
        return;
      }

      if (quantidade > produto.quantidade_estoque) {
        showToast('Não é possível baixar mais do que o estoque disponível.', 'error');
        updateStockHint();
        return;
      }

      await createSaida({
        produtoId,
        quantidade,
        valor_unitario: valorUnitarioInput ? Number(valorUnitarioInput) : null,
        motivo: qs<HTMLInputElement>('#motivo').value.trim(),
        destinatario: qs<HTMLInputElement>('#destinatario').value.trim() || null,
        data
      });

      await patchProduto(produto.id, {
        quantidade_estoque: produto.quantidade_estoque - quantidade
      });

      showToast('Saída registrada com sucesso.');
      form.reset();
      dateInput.value = getTodayLocalISO();
      produtos = await loadProdutosAtivos();
      renderProdutoOptions(select, produtos);
      updateStockHint();
    });

    updateStockHint();
  } catch (error) {
    console.error(error);
    showToast('Não foi possível carregar os produtos para saída.', 'error');
  }
}
