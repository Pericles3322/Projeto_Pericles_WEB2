import { createEntrada, createSaida, getProdutos, patchProduto } from './api.js';
import { getCurrentUser } from './auth.js';
import { initInputMasks } from './jquery-features.js';
import { getTodayLocalISO, qs, showToast } from './utils.js';
import { initViaCepLookup } from './viacep.js';
const LOTE_REGEX = /^LOTE-\d{4}-(0[1-9]|1[0-2])-[A-Z0-9]+$/i;
const LOTE_INPUT_REGEX = /^\d{4}-(0[1-9]|1[0-2])-[A-Z0-9]+$/i;
const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const LOTE_HELP_TEXT = 'Informe ano, mês e código. Os hífens são adicionados automaticamente.';

function formatLoteInput(value) {
  const characters = value
    .toUpperCase()
    .replace(/^LOTE-?/, '')
    .replace(/[^A-Z0-9]/g, '');
  const year = characters.slice(0, 4).replace(/\D/g, '');
  const month = characters.slice(4, 6).replace(/\D/g, '');
  const code = characters.slice(6);
  return [year, month, code].filter(Boolean).join('-');
}

function normalizeLote(value) {
  const lote = value.trim().toUpperCase();
  if (!lote) return '';
  if (LOTE_REGEX.test(lote)) return lote;
  if (!LOTE_INPUT_REGEX.test(lote)) return null;
  return `LOTE-${lote}`;
}

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
  const loteInput = document.getElementById('lote');
  const loteHelp = document.getElementById('lote-ajuda');
  if (!form || !select || !dateInput || !loteInput) return;
  dateInput.value = getTodayLocalISO();
  initInputMasks();
  const viaCep = initViaCepLookup();

  const updateLotePreview = (showError = false) => {
    const lote = normalizeLote(loteInput.value);
    loteInput.classList.remove('is-valid', 'is-invalid');

    if (!loteInput.value.trim()) {
      loteInput.setCustomValidity('');
      if (loteHelp) loteHelp.textContent = LOTE_HELP_TEXT;
      return;
    }

    if (lote) {
      loteInput.setCustomValidity('');
      loteInput.classList.add('is-valid');
      if (loteHelp) loteHelp.textContent = `Será salvo como ${lote}.`;
      return;
    }

    loteInput.setCustomValidity('Informe o lote no formato 2026-03-A123.');
    if (showError) loteInput.classList.add('is-invalid');
    if (loteHelp) loteHelp.textContent = 'Use o formato ano-mês-código, por exemplo: 2026-03-A123.';
  };

  loteInput.addEventListener('input', () => {
    loteInput.value = formatLoteInput(loteInput.value);
    updateLotePreview();
  });
  loteInput.addEventListener('blur', () => updateLotePreview(true));

  try {
    let produtos = await loadProdutosAtivos();
    renderProdutoOptions(select, produtos);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        form.reportValidity();
        showToast('Preencha corretamente os campos obrigatórios.', 'error');
        return;
      }
      produtos = await loadProdutosAtivos();
      const produtoId = Number(select.value);
      const quantidade = Number(qs('#quantidade_entrada').value);
      const valorUnitario = Number(qs('#valor_unitario_entrada').value || 0);
      const data = qs('#data_entrada').value;
      const lote = normalizeLote(loteInput.value);
      const cnpjFornecedor = qs('#cnpj_fornecedor').value.trim();
      const cepFornecedor = qs('#cep_fornecedor').value.trim();
      const produto = produtos.find((item) => item.id === produtoId);
      if (!produto) {
        showToast('Selecione um produto válido.', 'error');
        return;
      }
      if (quantidade <= 0) {
        showToast('A quantidade de entrada deve ser maior que zero.', 'error');
        return;
      }
      if (lote === null) {
        updateLotePreview(true);
        loteInput.focus();
        showToast('Informe o lote como 2026-03-A123.', 'error');
        return;
      }
      if (cnpjFornecedor && !CNPJ_REGEX.test(cnpjFornecedor)) {
        showToast('Informe o CNPJ no formato 00.000.000/0000-00.', 'error');
        return;
      }
      await createEntrada({
        produtoId,
        quantidade,
        valor_unitario: valorUnitario,
        lote,
        remetente: qs('#remetente').value.trim(),
        distribuidor: qs('#distribuidor').value.trim(),
        cnpj_fornecedor: cnpjFornecedor,
        cep_fornecedor: cepFornecedor,
        logradouro_fornecedor: qs('#logradouro_fornecedor').value.trim(),
        numero_fornecedor: qs('#numero_fornecedor').value.trim(),
        bairro_fornecedor: qs('#bairro_fornecedor').value.trim(),
        cidade_fornecedor: qs('#cidade_fornecedor').value.trim(),
        uf_fornecedor: qs('#uf_fornecedor').value.trim(),
        data,
        createdAt: new Date().toISOString()
      });
      await patchProduto(produto.id, {
        quantidade_estoque: produto.quantidade_estoque + quantidade
      });
      showToast('Entrada registrada com sucesso.');
      form.reset();
      form.classList.remove('was-validated');
      dateInput.value = getTodayLocalISO();
      updateLotePreview();
      viaCep.clear();
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
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        form.reportValidity();
        showToast('Preencha corretamente os campos obrigatórios.', 'error');
        return;
      }
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
      form.classList.remove('was-validated');
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
