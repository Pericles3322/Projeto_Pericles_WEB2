import { bindLogoutButtons, protectInternalPage } from '../../src/shared/auth.js';
import { initPainelPage } from '../../src/shared/produtos.js';

protectInternalPage();
bindLogoutButtons();
initPainelPage();
