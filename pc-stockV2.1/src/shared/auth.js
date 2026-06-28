import { getUsuarios } from './api.js';
import { qs, showToast } from './utils.js';
const STORAGE_KEY = 'pcstock_user';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
export function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '../login/';
}
export function protectInternalPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '../login/';
  }
}
export function bindLogoutButtons() {
  document.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', () => logout());
  });
}
export function initLoginPage() {
  const existingUser = getCurrentUser();
  if (existingUser) {
    window.location.href = '../dashboard/';
    return;
  }
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = qs('#email').value.trim();
    const senha = qs('#senha').value.trim();
    if (!email || !senha) {
      showToast('Preencha e-mail e senha para continuar.', 'error');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      showToast('Informe um e-mail válido, como nome@dominio.com.', 'error');
      return;
    }
    try {
      const usuarios = await getUsuarios();
      const usuario = usuarios.find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.senha === senha
      );
      if (!usuario) {
        showToast('E-mail ou senha inválidos.', 'error');
        return;
      }
      saveCurrentUser(usuario);
      showToast('Login realizado com sucesso.');
      window.setTimeout(() => {
        window.location.href = '../dashboard/';
      }, 450);
    } catch (error) {
      console.error(error);
      showToast('Não foi possível conectar ao serviço de dados.', 'error');
    }
  });
}
