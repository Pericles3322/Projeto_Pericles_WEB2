import { bindLogoutButtons, protectInternalPage } from '../../src/shared/auth.js';
import { initSaidaPage } from '../../src/shared/movimentacoes.js';

protectInternalPage();
bindLogoutButtons();
initSaidaPage();
