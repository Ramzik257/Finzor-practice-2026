import { initLayout, escapeHtml } from '../app.js';
import { api } from '../api.js';
import { loading, toast, modalOpen, modalClose } from '../components/ui.js';
import { labelStatus, labelPriority } from '../labels.js';

const state = { me: null, tasks: [], members: [], debounce: null };
const list = document.getElementById('taskList');
const filters = document.getElementById('filters');
const form = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');

function formatDate(value) {
  if (!value) return 'не указан';
  return new Date(value).toLocaleString('ru-RU');
}

function renderTasks() {
  if (!state.tasks.length) {
    list.innerHTML = '<p class="empty-state card section-card">Задач не найдено. Создайте первую задачу или сбросьте фильтры.</p>';
    return;
  }

  list.innerHTML = state.tasks.map((task) => {
    const canManage = state.me.role === 'admin' || Number(task.creator_id) === Number(state.me.id);
    return `
      <article class="card task-card">
        <h3>${escapeHtml(task.title)}</h3>
        <p class="muted">${escapeHtml(task.description || 'Без описания')}</p>
        <div class="task-meta">
          <span class="badge ${task.status}">${labelStatus(task.status)}</span>
          <span class="badge ${task.priority}">${labelPriority(task.priority)}</span>
        </div>
        <p class="muted">Постановщик: ${escapeHtml(task.creator_name || '—')}</p>
        <p class="muted">Ответственный: ${escapeHtml(task.assignee_name || 'не назначен')}</p>
        <p class="muted">Срок: ${formatDate(task.deadline)}</p>
        <div class="task-actions">
          ${canManage ? `
            <button type="button" class="btn secondary btn-sm" data-edit="${task.id}">Изменить</button>
            <button type="button" class="btn danger btn-sm" data-delete="${task.id}">Удалить</button>
          ` : ''}
          <button type="button" class="btn-sm" data-status="${task.id}">Следующий статус</button>
        </div>
      </article>
    `;
  }).join('');

  list.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => openEdit(Number(btn.dataset.edit)));
  list.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => removeTask(Number(btn.dataset.delete)));
  list.querySelectorAll('[data-status]').forEach((btn) => btn.addEventListener('click', () => nextStatus(Number(btn.dataset.status)));
}

async function loadMembers() {
  state.members = await api.members();
  const memberOptions = state.members
    .map((m) => `<option value="${m.id}">${escapeHtml(m.full_name || m.email)}</option>`)
    .join('');

  document.getElementById('assignee').innerHTML = `<option value="">Все</option>${memberOptions}`;
  document.getElementById('assigneeInput').innerHTML = `<option value="">Не назначен</option>${memberOptions}`;
}

async function loadTasks() {
  const params = new URLSearchParams();
  const searchInput = document.getElementById('search');
  if (searchInput?.value.trim()) params.set('search', searchInput.value.trim());
  [...new FormData(filters).entries()].forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString() ? `?${params}` : '';
  state.tasks = await api.tasks(query);
  renderTasks();
}

function openEdit(id) {
  const task = state.tasks.find((t) => Number(t.id) === id);
  if (!task) return;
  modalTitle.textContent = 'Редактирование задачи';
  form.id.value = task.id;
  form.title.value = task.title;
  form.description.value = task.description || '';
  form.assignee_id.value = task.assignee_id || '';
  form.deadline.value = task.deadline ? task.deadline.slice(0, 16) : '';
  form.priority.value = task.priority;
  form.status.value = task.status;
  modalOpen('taskModal');
}

function openCreate() {
  modalTitle.textContent = 'Новая задача';
  form.reset();
  form.id.value = '';
  form.priority.value = 'medium';
  form.status.value = 'pending';
  modalOpen('taskModal');
}

async function submitTask(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  if (!payload.title.trim()) {
    toast('Укажите название задачи', 'error');
    return;
  }
  if (!payload.assignee_id) payload.assignee_id = null;

  try {
    if (payload.id) {
      await api.updateTask({ ...payload, id: Number(payload.id) });
      toast('Задача обновлена');
    } else {
      await api.createTask(payload);
      toast('Задача создана');
    }
    modalClose('taskModal');
    await loadTasks();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function removeTask(id) {
  if (!confirm('Удалить эту задачу?')) return;
  try {
    await api.deleteTask(id);
    toast('Задача удалена');
    await loadTasks();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function nextStatus(id) {
  const task = state.tasks.find((t) => Number(t.id) === id);
  if (!task) return;
  const order = ['pending', 'in_progress', 'completed'];
  const next = order[(order.indexOf(task.status) + 1) % order.length];
  try {
    await api.updateTask({ id, action: 'change_status', status: next });
    toast('Статус изменён');
    await loadTasks();
  } catch (err) {
    toast(err.message, 'error');
  }
}

document.getElementById('createTaskBtn').addEventListener('click', openCreate);
document.getElementById('closeModal').addEventListener('click', () => modalClose('taskModal'));
document.getElementById('taskModal').addEventListener('click', (e) => {
  if (e.target.id === 'taskModal') modalClose('taskModal');
});
form.addEventListener('submit', submitTask);
filters.addEventListener('change', loadTasks);
document.getElementById('search').addEventListener('input', () => {
  clearTimeout(state.debounce);
  state.debounce = setTimeout(loadTasks, 300);
});
document.getElementById('resetFilters').addEventListener('click', () => {
  document.getElementById('search').value = '';
  filters.reset();
  loadTasks();
});

(async () => {
  loading(true);
  state.me = await initLayout();
  await loadMembers();
  await loadTasks();
  loading(false);
})();
