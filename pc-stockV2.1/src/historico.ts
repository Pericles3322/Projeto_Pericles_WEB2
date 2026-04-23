import { getEntradas, getProdutos, getSaidas } from './api';
import { getCurrentUser } from './auth';
import { escapeHTML, formatCurrency, formatDateBR, setHTML, sortDateOnlyDesc } from './utils';

interface HistoricoItem {
  data: string;
  produto: string;
  tipo: string;
  quantidade: number;
  valorUnitario: number | null;
  valorBruto: number | null;
  detalhes: string;
}

export async function initHistoricoPage(): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const produtos = await getProdutos(user.id);
    const entradas = await getEntradas();
    const saidas = await getSaidas();

    const produtoMap = new Map(produtos.map((item) => [item.id, item]));

    const cadastro = produtos.map<HistoricoItem>((produto) => ({
      data: produto.data_cadastro,
      produto: `${produto.nome}${produto.modelo ? ' - ' + produto.modelo : ''}${produto.ativo === false ? ' (inativo)' : ''}`,
      tipo: 'CADASTRO',
      quantidade: produto.quantidade_estoque,
      valorUnitario: produto.valor_venda,
      valorBruto: produto.quantidade_estoque * produto.valor_venda,
      detalhes: produto.ativo === false ? 'Cadastro inicial do produto | Produto inativo' : 'Cadastro inicial do produto'
    }));

    const itensEntrada = entradas
      .filter((item) => produtoMap.has(item.produtoId))
      .map<HistoricoItem>((entrada) => {
        const produto = produtoMap.get(entrada.produtoId)!;
        return {
          data: entrada.data,
          produto: `${produto.nome}${produto.modelo ? ' - ' + produto.modelo : ''}`,
          tipo: 'ENTRADA',
          quantidade: entrada.quantidade,
          valorUnitario: entrada.valor_unitario,
          valorBruto: entrada.quantidade * entrada.valor_unitario,
          detalhes: `${entrada.distribuidor || 'Sem distribuidor'} | ${entrada.lote || 'Sem lote'}`
        };
      });

    const itensSaida = saidas
      .filter((item) => produtoMap.has(item.produtoId))
      .map<HistoricoItem>((saida) => {
        const produto = produtoMap.get(saida.produtoId)!;
        return {
          data: saida.data,
          produto: `${produto.nome}${produto.modelo ? ' - ' + produto.modelo : ''}`,
          tipo: 'SAÍDA',
          quantidade: saida.quantidade,
          valorUnitario: saida.valor_unitario,
          valorBruto: saida.valor_unitario ? saida.quantidade * saida.valor_unitario : null,
          detalhes: `${saida.motivo}${saida.destinatario ? ' | ' + saida.destinatario : ''}`
        };
      });

    const historico = [...cadastro, ...itensEntrada, ...itensSaida].sort((a, b) =>
      sortDateOnlyDesc(a.data, b.data)
    );

    if (historico.length === 0) {
      setHTML('historico-table', '<div class="empty-state">Nenhuma movimentação encontrada.</div>');
      return;
    }

    const rows = historico
      .map((item) => {
        const badgeClass = item.tipo === 'ENTRADA' ? 'in-stock' : item.tipo === 'SAÍDA' ? 'low-stock' : 'out-stock';
        return `
          <tr>
            <td>${formatDateBR(item.data)}</td>
            <td>${escapeHTML(item.produto)}</td>
            <td><span class="pill-status ${badgeClass}">${item.tipo}</span></td>
            <td>${item.quantidade}</td>
            <td>${item.valorUnitario === null ? '—' : formatCurrency(item.valorUnitario)}</td>
            <td>${item.valorBruto === null ? '—' : formatCurrency(item.valorBruto)}</td>
            <td>${escapeHTML(item.detalhes)}</td>
          </tr>
        `;
      })
      .join('');

    setHTML(
      'historico-table',
      `
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
