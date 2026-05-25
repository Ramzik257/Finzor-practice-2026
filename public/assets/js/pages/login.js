import { api } from '../api.js';
import { loading, toast } from '../components/ui.js';

const form = document.getElementById('loginForm');
const errorEl = document.getElementById('loginError');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorEl.textContent = '';

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errorEl.textContent = 'Введите корректный адрес почты';
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = 'Пароль должен быть не короче 6 символов';
    return;
  }

  try {
    loading(true);
    await api.login(email, password);
    toast('Добро пожаловать!');
    window.location.href = 'tasks.html';
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    loading(false);
  }
});
