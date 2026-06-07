import{_ as e,a as t,c as n,d as r,g as i,l as a,n as o,o as s,p as c,s as l,u,y as d}from"./auth-BSo14gqT.js";function f(e){return e.quantidade_estoque<=0?{label:`Zerado`,className:`out-stock`}:e.quantidade_estoque<=5?{label:`Estoque baixo`,className:`low-stock`}:{label:`Em estoque`,className:`in-stock`}}async function p(){let t=o();if(t)try{let n=(await e(t.id)).filter(e=>e.ativo!==!1);m(n),h(n),g(n)}catch(e){console.error(e),u(`produtos-table`,`<div class="empty-state">Não foi possível carregar os produtos.</div>`)}}function m(e){let t=e.length;u(`dashboard-kpis`,`
      <div class="col-12 col-md-4">
        <div class="summary-card">
          <div class="summary-label">Produtos cadastrados</div>
          <div class="summary-value">${t}</div>
          <div class="text-secondary small">Itens ativos no inventário</div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="summary-card soft-cyan">
          <div class="summary-label">Unidades em estoque</div>
          <div class="summary-value">${e.reduce((e,t)=>e+t.quantidade_estoque,0)}</div>
          <div class="text-secondary small">Soma de todas as quantidades</div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="summary-card soft-pink">
          <div class="summary-label">Valor estimado</div>
          <div class="summary-value" style="font-size: 1.7rem;">${s(e.reduce((e,t)=>e+t.quantidade_estoque*t.valor_venda,0))}</div>
          <div class="text-secondary small">Baseado no valor de venda cadastrado</div>
        </div>
      </div>
    `)}function h(e){if(e.length===0){u(`produtos-table`,`<div class="empty-state">Nenhum produto cadastrado até o momento.</div>`);return}u(`produtos-table`,`
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
          <tbody>${e.map(e=>{let n=f(e),r=e.quantidade_estoque===0;return`
        <tr>
          <td>
            <div class="fw-semibold">${t(e.nome)}</div>
            <div class="text-secondary small">${t(e.modelo||`Sem modelo`)}</div>
          </td>
          <td><span class="pill-sku">ID-${e.id}</span></td>
          <td>${t(e.tipo||`Sem tipo`)}</td>
          <td class="fw-semibold">${e.quantidade_estoque}</td>
          <td><span class="pill-status ${n.className}">${n.label}</span></td>
          <td>${s(e.valor_venda)}</td>
          <td>${l(e.data_cadastro)}</td>
          <td>
            <div class="d-flex flex-wrap gap-2">
              <a class="btn btn-sm btn-outline-info" href="../new-product/?id=${e.id}" title="Editar produto">
                Editar
              </a>
              <button
                class="btn btn-sm ${r?`btn-outline-danger`:`btn-outline-secondary`}"
                data-delete-id="${e.id}"
                ${r?``:`disabled`}
                title="${r?`Apagar produto zerado`:`Só é possível apagar com estoque zerado`}"
              >
                Apagar
              </button>
            </div>
          </td>
        </tr>
      `}).join(``)}</tbody>
        </table>
      </div>
    `)}function g(e){document.querySelectorAll(`[data-delete-id]`).forEach(t=>{t.addEventListener(`click`,async()=>{let n=Number(t.dataset.deleteId),i=e.find(e=>e.id===n);if(i){if(i.quantidade_estoque!==0){r(`Só é possível apagar produtos com estoque zerado.`,`error`);return}if(window.confirm(`Deseja apagar o produto "${i.nome}" do inventário?`))try{await d(n,{ativo:!1}),r(`Produto removido do inventário.`),await p()}catch(e){console.error(e),r(`Não foi possível apagar o produto.`,`error`)}}})})}async function _(){let e=o();if(!e)return;let t=document.getElementById(`produto-form`);if(!t)return;let s=document.querySelector(`.app-topbar h2`),l=document.querySelector(`.form-card h3`),u=document.querySelector(`.form-card .page-note`),f=t.querySelector(`button[type="submit"]`),p=new URL(window.location.href),m=Number(p.searchParams.get(`id`)),h=Number.isFinite(m)&&m>0,g=null;if(h)try{let t=await i(m);if(!t||t.usuarioId!==e.id){r(`Produto não encontrado para edição.`,`error`),window.location.href=`../dashboard/`;return}g=t,a(`#nome`).value=t.nome,a(`#modelo`).value=t.modelo,a(`#tipo`).value=t.tipo,a(`#valor_venda`).value=String(t.valor_venda??``),a(`#especificacoes_tecnicas`).value=t.especificacoes_tecnicas,a(`#informacoes_adicionais`).value=t.informacoes_adicionais,s&&(s.textContent=`Editar Produto`),l&&(l.textContent=`Editar produto`),u&&(u.textContent=`Altere os dados do produto. O estoque atual deste item é ${t.quantidade_estoque}.`),f&&(f.textContent=`Salvar alterações`),document.title=`PC-Stock | Editar Produto`}catch(e){console.error(e),r(`Não foi possível carregar o produto para edição.`,`error`);return}t.addEventListener(`submit`,async i=>{i.preventDefault();let o={usuarioId:e.id,nome:a(`#nome`).value.trim(),modelo:a(`#modelo`).value.trim(),tipo:a(`#tipo`).value.trim(),especificacoes_tecnicas:a(`#especificacoes_tecnicas`).value.trim(),informacoes_adicionais:a(`#informacoes_adicionais`).value.trim(),valor_venda:Number(a(`#valor_venda`).value||0)};if(!o.nome){r(`Informe pelo menos o nome do produto.`,`error`);return}try{if(g){await d(g.id,{nome:o.nome,modelo:o.modelo,tipo:o.tipo,especificacoes_tecnicas:o.especificacoes_tecnicas,informacoes_adicionais:o.informacoes_adicionais,valor_venda:o.valor_venda}),r(`Produto atualizado com sucesso.`),window.setTimeout(()=>{window.location.href=`../dashboard/`},450);return}await c({...o,quantidade_estoque:0,quantidade_cadastro:0,data_cadastro:n(),createdAt:new Date().toISOString(),ativo:!0}),r(`Produto cadastrado com sucesso.`),t.reset()}catch(e){console.error(e),r(g?`Não foi possível atualizar o produto.`:`Não foi possível cadastrar o produto.`,`error`)}})}export{p as n,_ as t};