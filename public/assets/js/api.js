const API = '/backend/api';

async function req(path, options = {}) {
  const r = await fetch(`${API}/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const text = await r.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error('Ошибка сервера. Проверьте запуск PHP и MySQL.');
  }

  const isLogin = path.includes('auth.php') && path.includes('action=login');

  if (r.status === 401 && !isLogin) {
    window.location.href = 'login.html';
    throw new Error(body.error || 'Требуется авторизация');
  }

  if (!r.ok || !body.success) {
    throw new Error(body.error || 'Ошибка запроса');
  }

  return body.data;
}

export const api = {
  me: () => req('auth.php?action=me'),
  login: (email, password) => req('auth.php?action=login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => req('auth.php?action=logout', { method: 'POST', body: '{}' }),
  dashboard: () => req('dashboard.php'),
  members: () => req('members.php'),
  tasks: (q = '') => req(`tasks.php${q}`),
  createTask: (p) => req('tasks.php', { method: 'POST', body: JSON.stringify(p) }),
  updateTask: (p) => req('tasks.php', { method: 'PUT', body: JSON.stringify(p) }),
  deleteTask: (id) => req(`tasks.php?id=${id}`, { method: 'DELETE' }),
  news: () => req('news.php'),
  createNews: (p) => req('news.php', { method: 'POST', body: JSON.stringify(p) }),
  deleteNews: (id) => req(`news.php?id=${id}`, { method: 'DELETE' }),
  users: () => req('users.php'),
  createUser: (p) => req('users.php', { method: 'POST', body: JSON.stringify(p) }),
  updateUser: (p) => req('users.php', { method: 'PUT', body: JSON.stringify(p) }),
  deleteUser: (id) => req(`users.php?id=${id}`, { method: 'DELETE' }),
};
