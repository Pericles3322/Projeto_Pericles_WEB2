import { getEntradas, getProdutos, getSaidas } from './api.js';
import { getCurrentUser } from './auth.js';
import { escapeHTML, formatCurrency, formatDateBR, setHTML } from './utils.js';

function getEventOrder(item) {
  if (item.createdAt) return item.createdAt;

  const date = item.data || item.data_cadastro || '';

  if (item.id != null) {
    return `${date}T00:00:00.${String(item.id).padStart(6, '0')}`;
  }

  return date;
}

export async function initHistoricoPage() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const produtos = await getProdutos(user.id);
    const entradas = await getEntradas();
    const saidas = await getSaidas();

    const produtoMap = new Map(produtos.map((produto) => [produto.id, produto]));

    const cadastro = produtos.map((produto) => {
      const quantidadeCadastro = Number(produto.quantidade_cadastro ?? 0);

      return {
        id: produto.id,
        data: produto.data_cadastro,
        createdAt: produto.createdAt || produto.data_cadastro,
        produto: `${produto.nome}${produto.modelo ? ' - ' + produto.modelo : ''}${produto.ativo === false ? ' (inativo)' : ''}`,
        tipo: 'CADASTRO',
        quantidade: quantidadeCadastro,
        valorUnitario: produto.valor_venda,
        valorBruto: quantidadeCadastro * produto.valor_venda,
        cnpjFornecedor: '',
        detalhes:
          produto.ativo === false
            ? 'Cadastro inicial do produto | Produto inativo'
            : 'Cadastro inicial do produto'
      };
    });

    const itensEntrada = entradas
      .filter((entrada) => produtoMap.has(entrada.produtoId))
      .map((entrada) => {
        const produto = produtoMap.get(entrada.produtoId);

        return {
          id: entrada.id,
          data: entrada.data,
          createdAt: entrada.createdAt || entrada.data,
          produto: `${produto.nome}${produto.modelo ? ' - ' + produto.modelo : ''}`,
          tipo: 'ENTRADA',
          quantidade: entrada.quantidade,
          valorUnitario: entrada.valor_unitario,
          valorBruto: entrada.quantidade * entrada.valor_unitario,
          cnpjFornecedor: entrada.cnpj_fornecedor,
          detalhes: [
            entrada.distribuidor || 'Sem distribuidor',
            entrada.lote || 'Sem lote',
            entrada.cidade_fornecedor ? `${entrada.cidade_fornecedor}/${entrada.uf_fornecedor || '—'}` : ''
          ]
            .filter(Boolean)
            .join(' | ')
        };
      });

    const itensSaida = saidas
      .filter((saida) => produtoMap.has(saida.produtoId))
      .map((saida) => {
        const produto = produtoMap.get(saida.produtoId);

        return {
          id: saida.id,
          data: saida.data,
          createdAt: saida.createdAt || saida.data,
          produto: `${produto.nome}${produto.modelo ? ' - ' + produto.modelo : ''}`,
          tipo: 'SAÍDA',
          quantidade: saida.quantidade,
          valorUnitario: saida.valor_unitario,
          valorBruto: saida.valor_unitario ? saida.quantidade * saida.valor_unitario : null,
          cnpjFornecedor: '',
          detalhes: `${saida.motivo}${saida.destinatario ? ' | ' + saida.destinatario : ''}`
        };
      });

    const historico = [...cadastro, ...itensEntrada, ...itensSaida].sort((a, b) => {
      return getEventOrder(b).localeCompare(getEventOrder(a));
    });

    if (historico.length === 0) {
      setHTML('historico-table', '<div class="empty-state">Nenhuma movimentação encontrada.</div>');
      return;
    }

    const rows = historico
      .map((item) => {
        const badgeClass =
          item.tipo === 'ENTRADA' ? 'in-stock' : item.tipo === 'SAÍDA' ? 'low-stock' : 'out-stock';

        return `
          <tr>
            <td>${formatDateBR(item.data)}</td>
            <td>${escapeHTML(item.produto)}</td>
            <td><span class="pill-status ${badgeClass}">${item.tipo}</span></td>
            <td>${item.quantidade}</td>
            <td>${item.valorUnitario === null ? '—' : formatCurrency(item.valorUnitario)}</td>
            <td>${item.valorBruto === null ? '—' : formatCurrency(item.valorBruto)}</td>
            <td class="text-nowrap">${escapeHTML(item.cnpjFornecedor || '—')}</td>
            <td>${escapeHTML(item.detalhes)}</td>
          </tr>
        `;
      })
      .join('');

    setHTML(
      'historico-table',
      `
        <p class="table-scroll-note">Arraste a tabela para o lado para ver todas as informações.</p>
        <div class="table-responsive">
          <table class="table table-kinetic align-middle">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Valor unitário</th>
                <th>Valor bruto</th>
                <th>CNPJ do fornecedor</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `
    );
  } catch (error) {
    console.error(error);
    setHTML('historico-table', '<div class="empty-state">Não foi possível carregar o histórico.</div>');
  }
}
