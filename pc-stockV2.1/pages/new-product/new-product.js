import { bindLogoutButtons, protectInternalPage } from '../../src/shared/auth.js';
import { initNovoProdutoPage } from '../../src/shared/produtos.js';

document.addEventListener('DOMContentLoaded', () => {
  protectInternalPage();
  bindLogoutButtons();
  initNovoProdutoPage();
});
