import { api } from './api.js';

export async function initLayout(requireAdmin = false) {
  const me = await api.me();
  if (requireAdmin && me.role !== 'admin') { window.location.href = 'tasks.html'; return null; }
  document.getElementById('currentUserName') && (document.getElementById('currentUserName').textContent = me.full_name || me.email);
  document.getElementById('currentUserRole') && (document.getElementById('currentUserRole').textContent = me.role);
  document.getElementById('logoutBtn')?.addEventListener('click', async () => { await api.logout(); window.location.href = 'login.html'; });
  if (me.role !== 'admin') document.getElementById('adminLink')?.remove();
  return me;
}
