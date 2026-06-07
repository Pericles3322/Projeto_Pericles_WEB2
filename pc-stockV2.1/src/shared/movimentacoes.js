import { createEntrada, createSaida, getProdutos, patchProduto } from './api.js';
import { getCurrentUser } from './auth.js';
import { getTodayLocalISO, qs, showToast } from './utils.js';
async function loadProdutosAtivos() {
  const user = getCurrentUser();
  if (!user) return [];
  const produtos = await getProdutos(user.id);
  return produtos.filter((item) => item.ativo !== false);
}
function renderProdutoOptions(select, produtos) {
  select.innerHTML = `
    <option value="">Selecione um produto</option>
    ${produtos
      .map(
        (produto) =>
          `<option value="${produto.id}">${produto.nome} - ${produto.modelo || 'Sem modelo'}</option>`
      )
      .join('')}
  `;
}
export async function initEntradaPage() {
  const form = document.getElementById('entrada-form');
  const select = document.getElementById('produto_id_entrada');
  const dateInput = document.getElementById('data_entrada');
  if (!form || !select || !dateInput) return;
  dateInput.value = getTodayLocalISO();
  try {
    let produtos = await loadProdutosAtivos();
    renderProdutoOptions(select, produtos);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      produtos = await loadProdutosAtivos();
      const produtoId = Number(select.value);
      const quantidade = Number(qs('#quantidade_entrada').value);
      const valorUnitario = Number(qs('#valor_unitario_entrada').value || 0);
      const data = qs('#data_entrada').value;
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
        lote: qs('#lote').value.trim(),
        remetente: qs('#remetente').value.trim(),
        distribuidor: qs('#distribuidor').value.trim(),
        data,
        createdAt: new Date().toISOString()
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
export async function initSaidaPage() {
  const form = document.getElementById('saida-form');
  const select = document.getElementById('produto_id_saida');
  const dateInput = document.getElementById('data_saida');
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
      const quantidade = Number(qs('#quantidade_saida').value);
      const valorUnitarioInput = qs('#valor_unitario_saida').value;
      const data = qs('#data_saida').value;
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
        motivo: qs('#motivo').value.trim(),
        destinatario: qs('#destinatario').value.trim() || null,
        data,
        createdAt: new Date().toISOString()
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
