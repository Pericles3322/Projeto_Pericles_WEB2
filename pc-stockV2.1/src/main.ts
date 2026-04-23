import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './noop';
import '../style.css';

import { bindLogoutButtons, initLoginPage, protectInternalPage } from './auth';
import { initPainelPage, initNovoProdutoPage } from './produtos';
import { initEntradaPage, initSaidaPage } from './movimentacoes';
import { initHistoricoPage } from './historico';
import type { AppPage } from './utils';

const page = (document.body.dataset.page ?? 'login') as AppPage;

if (page !== 'login') {
  protectInternalPage();
  bindLogoutButtons();
}

switch (page) {
  case 'login':
    initLoginPage();
    break;
  case 'painel':
    initPainelPage();
    break;
  case 'novo-produto':
    initNovoProdutoPage();
    break;
  case 'entrada':
    initEntradaPage();
    break;
  case 'saida':
    initSaidaPage();
    break;
  case 'historico':
    initHistoricoPage();
    break;
}
