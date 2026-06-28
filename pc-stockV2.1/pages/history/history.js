import { bindLogoutButtons, protectInternalPage } from '../../src/shared/auth.js';
import { initHistoricoPage } from '../../src/shared/historico.js';

protectInternalPage();
bindLogoutButtons();
initHistoricoPage();
