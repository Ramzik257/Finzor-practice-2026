import { initLayout, escapeHtml } from '../app.js';
import { api } from '../api.js';
import { loading, toast } from '../components/ui.js';
import { labelRole } from '../labels.js';

let users = [];
const tableBody = document.getElementById('usersTableBody');
const form = document.getElementById('createUserForm');

function statusLabel(isBlocked) {
  return Number(isBlocked) ? 'Заблокирован' : 'Активен';
}

function statusClass(isBlocked) {
  return Number(isBlocked) ? 'high' : 'completed';
}

async function loadUsers() {
  users = await api.users();
  tableBody.innerHTML = users.map((user) => `
    <tr>
      <td>${user.id}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.full_name || '—')}</td>
      <td><span class="badge role-${user.role === 'admin' ? 'admin' : 'employee'}">${labelRole(user.role)}</span></td>
      <td><span class="badge ${statusClass(user.is_blocked)}">${statusLabel(user.is_blocked)}</span></td>
      <td class="task-actions">
        <button type="button" class="btn secondary btn-sm" data-block="${user.id}">
          ${Number(user.is_blocked) ? 'Разблокировать' : 'Заблокировать'}
        </button>
        <button type="button" class="btn secondary btn-sm" data-role="${user.id}">Сменить роль</button>
        <button type="button" class="btn danger btn-sm" data-delete="${user.id}">Удалить</button>
      </td>
    </tr>
  `).join('');

  tableBody.querySelectorAll('[data-block]').forEach((btn) => {
    btn.addEventListener('click', () => toggleBlock(Number(btn.dataset.block)));
  });
  tableBody.querySelectorAll('[data-role]').forEach((btn) => {
    btn.addEventListener('click', () => toggleRole(Number(btn.dataset.role)));
  });
  tableBody.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => removeUser(Number(btn.dataset.delete)));
  });
}

async function createUser(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  if (!/^\S+@\S+\.\S+$/.test(payload.email || '') || (payload.password || '').length < 6) {
    toast('Проверьте почту и пароль', 'error');
    return;
  }
  try {
    await api.createUser(payload);
    form.reset();
    toast('Пользователь создан');
    await loadUsers();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function toggleBlock(id) {
  const user = users.find((u) => Number(u.id) === id);
  if (!user) return;
  await api.updateUser({
    id,
    role: user.role,
    is_blocked: !Number(user.is_blocked),
  });
  toast('Статус обновлён');
  await loadUsers();
}

async function toggleRole(id) {
  const user = users.find((u) => Number(u.id) === id);
  if (!user) return;
  const newRole = user.role === 'admin' ? 'employee' : 'admin';
  await api.updateUser({
    id,
    role: newRole,
    is_blocked: user.is_blocked,
  });
  toast('Роль изменена');
  await loadUsers();
}

async function removeUser(id) {
  if (!confirm('Удалить этого пользователя?')) return;
  try {
    await api.deleteUser(id);
    toast('Пользователь удалён');
    await loadUsers();
  } catch (err) {
    toast(err.message, 'error');
  }
}

form.addEventListener('submit', createUser);

(async () => {
  loading(true);
  await initLayout(true);
  await loadUsers();
  loading(false);
})();
