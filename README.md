# Корпоративный портал

Внутренний портал для командной разработки: задачи, новости, роли, админ-панель.

## Установка

1. Создать БД и таблицы: импорт `database/schema.sql`
2. Заполнить тестовыми данными: импорт `database/seed.sql`
3. Указать параметры подключения в `backend/config/database.php`

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

## Роли

- **admin** — управление пользователями, удаление новостей, полный доступ к задачам
- **employee** — создание задач и новостей, редактирование только своих задач

## Структура

```
backend/api/     — API (auth, tasks, news, users, dashboard)
backend/core/    — подключение к БД, сессии
public/          — фронтенд (HTML, CSS, JS)
database/        — SQL-схема и seed
```
