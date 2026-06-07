export function getTodayLocalISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export function formatDateBR(value) {
  if (!value) return '—';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(parsed);
}
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value ?? 0);
}
export function qs(selector, parent = document) {
  const element = parent.querySelector(selector);
  if (!element) throw new Error(`Elemento não encontrado: ${selector}`);
  return element;
}
export function setHTML(id, html) {
  const target = document.getElementById(id);
  if (target) target.innerHTML = html;
}
export function escapeHTML(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
export function showToast(message, type = 'success') {
  let area = document.getElementById('toast-area');
  if (!area) {
    area = document.createElement('div');
    area.id = 'toast-area';
    area.className = 'toast-area';
    document.body.appendChild(area);
  }
  const toast = document.createElement('div');
  toast.className = `toast-card ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  area.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}
