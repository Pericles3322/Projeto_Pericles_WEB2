import { bindLogoutButtons, protectInternalPage } from '../../src/shared/auth.js';
import { initEntradaPage } from '../../src/shared/movimentacoes.js';

protectInternalPage();
bindLogoutButtons();
initEntradaPage();
