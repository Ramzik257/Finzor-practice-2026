export function toast(message, type = 'success') {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
export function loading(show) {
  document.getElementById('globalLoader')?.classList.toggle('hidden', !show);
}
export function modalOpen(id) { document.getElementById(id)?.classList.add('open'); }
export function modalClose(id) { document.getElementById(id)?.classList.remove('open'); }
