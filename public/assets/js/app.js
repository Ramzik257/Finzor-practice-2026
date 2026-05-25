import { api } from './api.js';
import { labelRole } from './labels.js';

export async function initLayout(requireAdmin = false) {
  const me = await api.me();
  if (requireAdmin && me.role !== 'admin') {
    window.location.href = 'tasks.html';
    return null;
  }

  const nameEl = document.getElementById('currentUserName');
  const roleEl = document.getElementById('currentUserRole');
  if (nameEl) nameEl.textContent = me.full_name || me.email;
  if (roleEl) roleEl.textContent = labelRole(me.role);

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await api.logout();
    window.location.href = 'login.html';
  });

  if (me.role !== 'admin') {
    document.getElementById('adminLink')?.remove();
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelector(`.nav a[data-page="${page}"]`)?.classList.add('active');
  }

  return me;
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[ch]));
}
