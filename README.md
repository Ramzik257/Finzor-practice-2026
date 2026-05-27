# Корпоративный портал

Внутренний портал для командной разработки: задачи, новости, роли, админ-панель.

## Установка

1. Создать БД и таблицы: импорт `database/schema.sql`
2. Заполнить тестовыми данными: импорт `database/seed.sql`
3. **Обязательно** исправить пароли (хеши в SQL могут не совпадать):
   - через браузер (один раз):  
     `http://localhost:8000/backend/api/dev_reset_passwords.php?key=portal2026`  
     затем удалить файл `backend/api/dev_reset_passwords.php`
   - или в терминале: `php database/fix_passwords.php`
4. Указать параметры подключения в `backend/config/database.php`

## Запуск

```bash
php -S localhost:8000
```

Открыть: http://localhost:8000/public/login.html

## Тестовые аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | employee |
| user2@example.com | user123 | employee |
| user3@example.com | user123 | employee |
| user4@example.com | user123 | employee |
| user5@example.com | user123 | employee |

Повторный импорт `database/seed.sql` перезапишет тестовые данные (очистит таблицы и заполнит заново).

## Роли

- **admin** — управление пользователями, удаление новостей, полный доступ к задачам
- **employee** — создание задач и новостей, редактирование только своих задач

## Структура

```
backend/api/     — API (auth, tasks, news, users, dashboard)
backend/core/    — подключение к БД, сессии
public/          — фронтенд (HTML, CSS, JS)
database/        — SQL-схема и seed
.github/workflows/ — CI/CD (GitHub Actions)
```

## CI/CD

После push в GitHub автоматически запускается проверка:

- **CI** (`ci.yml`) — синтаксис PHP, наличие ключевых файлов проекта
- **CD** (`cd.yml`) — сборка zip-архива для выкладки (артефакт в Actions)

Статус проверок: вкладка **Actions** в репозитории на GitHub.
