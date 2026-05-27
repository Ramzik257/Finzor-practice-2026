import { initLayout, escapeHtml } from '../app.js';
import { api } from '../api.js';
import { loading } from '../components/ui.js';
import { labelStatus } from '../labels.js';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('ru-RU');
}

(async () => {
  loading(true);
  const me = await initLayout();
  const data = await api.dashboard();

  const displayName = data.user_name || me?.full_name || me?.email || 'коллега';
  document.getElementById('welcomeName').textContent = displayName;

  document.getElementById('statTotal').textContent = data.stats.total;
  document.getElementById('statProgress').textContent = data.stats.in_progress;
  document.getElementById('statPending').textContent = data.stats.pending;
  document.getElementById('statCompleted').textContent = data.stats.completed;
  document.getElementById('statNews').textContent = data.stats.news;
  document.getElementById('statUsers').textContent = data.stats.users;

  const newsEl = document.getElementById('latestNews');
  newsEl.innerHTML = data.latest_news.length
    ? data.latest_news.map((n) => `
        <li>
          <strong>${escapeHtml(n.title)}</strong>
          <span class="muted"> — ${escapeHtml(n.author_name || 'автор не указан')}, ${formatDate(n.created_at)}</span>
        </li>
      `).join('')
    : '<li class="muted">Новостей пока нет</li>';

  const tasksEl = document.getElementById('myTasks');
  tasksEl.innerHTML = data.my_tasks.length
    ? data.my_tasks.map((t) => `
        <li>
          ${escapeHtml(t.title)}
          <span class="badge ${t.status}">${labelStatus(t.status)}</span>
          ${t.deadline ? `<span class="muted"> до ${formatDate(t.deadline)}</span>` : ''}
        </li>
      `).join('')
    : '<li class="muted">Задач пока нет</li>';

  loading(false);
})();
