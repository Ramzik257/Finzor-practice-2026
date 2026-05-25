import { initLayout, escapeHtml } from '../app.js';
import { api } from '../api.js';
import { loading } from '../components/ui.js';
import { labelStatus } from '../labels.js';

(async () => {
  loading(true);
  await initLayout();
  const data = await api.dashboard();

  document.getElementById('statTotal').textContent = data.stats.total;
  document.getElementById('statCompleted').textContent = data.stats.completed;
  document.getElementById('statProgress').textContent = data.stats.in_progress;

  const newsEl = document.getElementById('latestNews');
  newsEl.innerHTML = data.latest_news.length
    ? data.latest_news.map((n) => `<li>${escapeHtml(n.title)} <span class="muted">— ${escapeHtml(n.author_name || 'автор не указан')}</span></li>`).join('')
    : '<li class="muted">Новостей пока нет</li>';

  const tasksEl = document.getElementById('myTasks');
  tasksEl.innerHTML = data.my_tasks.length
    ? data.my_tasks.map((t) => `<li>${escapeHtml(t.title)} <span class="badge ${t.status}">${labelStatus(t.status)}</span></li>`).join('')
    : '<li class="muted">Задач пока нет</li>';

  loading(false);
})();
