import { getUsuarios, type Usuario } from './api';
import { qs, showToast } from './utils';

const STORAGE_KEY = 'pcstock_user';

export function getCurrentUser(): Usuario | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: Usuario): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/index.html';
}

export function protectInternalPage(): void {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/index.html';
  }
}

export function bindLogoutButtons(): void {
  document.querySelectorAll<HTMLElement>('[data-logout]').forEach((button) => {
    button.addEventListener('click', () => logout());
  });
}

export function initLoginPage(): void {
  const existingUser = getCurrentUser();
  if (existingUser) {
    window.location.href = '/painel.html';
    return;
  }

  const form = document.getElementById('login-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = qs<HTMLInputElement>('#email').value.trim();
    const senha = qs<HTMLInputElement>('#senha').value.trim();

    if (!email || !senha) {
      showToast('Preencha e-mail e senha para continuar.', 'error');
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
        window.location.href = '/painel.html';
      }, 450);
    } catch (error) {
      console.error(error);
      showToast('Não foi possível conectar à API Fake.', 'error');
    }
  });
}
