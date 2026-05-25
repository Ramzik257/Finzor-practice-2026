import { initLayout, escapeHtml } from '../app.js';
import { api } from '../api.js';
import { loading, toast } from '../components/ui.js';

let me = null;
const list = document.getElementById('newsList');
const form = document.getElementById('newsForm');

async function loadNews() {
  const news = await api.news();
  if (!news.length) {
    list.innerHTML = '<p class="empty-state card section-card">Новостей пока нет</p>';
    return;
  }

  list.innerHTML = news.map((item) => `
    <article class="card news-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p class="muted">${escapeHtml(item.author_name || 'Автор не указан')} · ${new Date(item.created_at).toLocaleString('ru-RU')}</p>
      <p>${escapeHtml(item.content).replace(/\n/g, '<br>')}</p>
      ${me.role === 'admin' ? `<button type="button" class="btn danger btn-sm" data-delete="${item.id}">Удалить</button>` : ''}
    </article>
  `).join('');

  list.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => removeNews(Number(btn.dataset.delete)));
  });
}

async function createNews(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  if (!payload.title.trim() || !payload.content.trim()) {
    toast('Заполните заголовок и текст', 'error');
    return;
  }
  try {
    await api.createNews(payload);
    form.reset();
    toast('Новость опубликована');
    await loadNews();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function removeNews(id) {
  if (!confirm('Удалить эту новость?')) return;
  try {
    await api.deleteNews(id);
    toast('Новость удалена');
    await loadNews();
  } catch (err) {
    toast(err.message, 'error');
  }
}

form.addEventListener('submit', createNews);

(async () => {
  loading(true);
  me = await initLayout();
  await loadNews();
  loading(false);
})();
