import{_ as e,a as t,b as n,h as r,i,n as a,o,s,t as c,u as l,v as u}from"./auth-BSo14gqT.js";n();function d(e){if(e.createdAt)return e.createdAt;let t=e.data||e.data_cadastro||``;return e.id==null?t:`${t}T00:00:00.${String(e.id).padStart(6,`0`)}`}async function f(){let n=a();if(n)try{let i=await e(n.id),a=await r(),c=await u(),f=new Map(i.map(e=>[e.id,e])),p=i.map(e=>{let t=Number(e.quantidade_cadastro??0);return{id:e.id,data:e.data_cadastro,createdAt:e.createdAt||e.data_cadastro,produto:`${e.nome}${e.modelo?` - `+e.modelo:``}${e.ativo===!1?` (inativo)`:``}`,tipo:`CADASTRO`,quantidade:t,valorUnitario:e.valor_venda,valorBruto:t*e.valor_venda,detalhes:e.ativo===!1?`Cadastro inicial do produto | Produto inativo`:`Cadastro inicial do produto`}}),m=a.filter(e=>f.has(e.produtoId)).map(e=>{let t=f.get(e.produtoId);return{id:e.id,data:e.data,createdAt:e.createdAt||e.data,produto:`${t.nome}${t.modelo?` - `+t.modelo:``}`,tipo:`ENTRADA`,quantidade:e.quantidade,valorUnitario:e.valor_unitario,valorBruto:e.quantidade*e.valor_unitario,detalhes:`${e.distribuidor||`Sem distribuidor`} | ${e.lote||`Sem lote`}`}}),h=c.filter(e=>f.has(e.produtoId)).map(e=>{let t=f.get(e.produtoId);return{id:e.id,data:e.data,createdAt:e.createdAt||e.data,produto:`${t.nome}${t.modelo?` - `+t.modelo:``}`,tipo:`SAÍDA`,quantidade:e.quantidade,valorUnitario:e.valor_unitario,valorBruto:e.valor_unitario?e.quantidade*e.valor_unitario:null,detalhes:`${e.motivo}${e.destinatario?` | `+e.destinatario:``}`}}),g=[...p,...m,...h].sort((e,t)=>d(t).localeCompare(d(e)));if(g.length===0){l(`historico-table`,`<div class="empty-state">Nenhuma movimentação encontrada.</div>`);return}l(`historico-table`,`
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
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>${g.map(e=>{let n=e.tipo===`ENTRADA`?`in-stock`:e.tipo===`SAÍDA`?`low-stock`:`out-stock`;return`
          <tr>
            <td>${s(e.data)}</td>
            <td>${t(e.produto)}</td>
            <td><span class="pill-status ${n}">${e.tipo}</span></td>
            <td>${e.quantidade}</td>
            <td>${e.valorUnitario===null?`—`:o(e.valorUnitario)}</td>
            <td>${e.valorBruto===null?`—`:o(e.valorBruto)}</td>
            <td>${t(e.detalhes)}</td>
          </tr>
        `}).join(``)}</tbody>
          </table>
        </div>
      `)}catch(e){console.error(e),l(`historico-table`,`<div class="empty-state">Não foi possível carregar o histórico.</div>`)}}i(),c(),f();