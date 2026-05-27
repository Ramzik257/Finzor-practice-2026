USE corp_portal;

-- Очистка данных (DELETE надёжнее TRUNCATE при внешних ключах в phpMyAdmin)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM logs;
DELETE FROM news;
DELETE FROM tasks;
DELETE FROM users;
ALTER TABLE logs AUTO_INCREMENT = 1;
ALTER TABLE news AUTO_INCREMENT = 1;
ALTER TABLE tasks AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- Пароли: admin123 / user123 (bcrypt)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@example.com', '$2y$10$3m0r6nMdaWfN3hO3Y5fYKe8S7f9M7cV95PPApQN5ti2WTRwMABe5G', 'Администратор', 'admin'),
('user@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Иван Иванов', 'employee'),
('user2@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Петр Петров', 'employee'),
('user3@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Анна Смирнова', 'employee'),
('user4@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Мария Козлова', 'employee'),
('user5@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Дмитрий Соколов', 'employee');

INSERT INTO tasks (title, description, creator_id, assignee_id, deadline, status, priority, created_at) VALUES
('Подготовить UI-kit', 'Собрать переиспользуемые компоненты: кнопки, карточки, формы и модальные окна.', 1, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'in_progress', 'high', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Настроить авторизацию', 'Реализовать вход и выход через PHP-сессии, проверка ролей на API.', 1, 3, DATE_ADD(NOW(), INTERVAL 1 DAY), 'pending', 'high', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Оформить главную страницу', 'Добавить статистику, блок новостей и список личных задач.', 2, 4, DATE_ADD(NOW(), INTERVAL 3 DAY), 'in_progress', 'medium', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Проверить фильтры задач', 'Протестировать поиск, статус, приоритет, срок и ответственного.', 2, 2, DATE_ADD(NOW(), INTERVAL 4 DAY), 'pending', 'medium', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Наполнить ленту новостей', 'Подготовить стартовые публикации для демонстрации портала.', 3, 5, DATE_SUB(NOW(), INTERVAL 1 DAY), 'completed', 'low', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Адаптивная вёрстка', 'Проверить отображение на телефоне и планшете, поправить сетку карточек.', 4, 4, DATE_ADD(NOW(), INTERVAL 5 DAY), 'pending', 'medium', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Документация README', 'Описать установку, запуск, роли и тестовые аккаунты.', 1, 3, DATE_ADD(NOW(), INTERVAL 6 DAY), 'in_progress', 'low', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Настроить CI на GitHub', 'Добавить автоматическую проверку PHP при push и pull request.', 1, 5, DATE_ADD(NOW(), INTERVAL 2 DAY), 'completed', 'high', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('Ревью API задач', 'Проверить права сотрудника: редактирование только своих задач.', 5, 2, DATE_ADD(NOW(), INTERVAL 7 DAY), 'pending', 'high', NOW()),
('Подготовить презентацию', 'Собрать скриншоты основных экранов для защиты проекта.', 3, 3, DATE_ADD(NOW(), INTERVAL 10 DAY), 'pending', 'medium', NOW()),
('Оптимизация SQL-запросов', 'Проверить JOIN в списках задач и новостей, добавить индексы при необходимости.', 5, 5, DATE_ADD(NOW(), INTERVAL 8 DAY), 'in_progress', 'low', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Тестирование админ-панели', 'Создание, блокировка и удаление пользователей.', 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'completed', 'medium', DATE_SUB(NOW(), INTERVAL 9 DAY));

INSERT INTO news (title, content, author_id, created_at) VALUES
('Запуск портала v1', 'Команда запустила первую версию внутреннего портала. Доступны задачи, новости и админ-панель.', 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Обновление интерфейса', 'Интерфейс переведён на русский язык, обновлены карточки и навигация.', 2, DATE_SUB(NOW(), INTERVAL 7 DAY)),
('План на неделю', 'Фокус на наполнении контентом, улучшении главной страницы и стабилизации API.', 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Новые участники команды', 'К проекту подключились Анна, Мария и Дмитрий. Добро пожаловать!', 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Code Review пятница', 'Каждую пятницу в 15:00 — общий разбор задач и pull request''ов.', 4, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Напоминание по дедлайнам', 'Проверяйте сроки задач в разделе «Задачи» и обновляйте статусы вовремя.', 5, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('CI настроен', 'GitHub Actions проверяет PHP-код автоматически при каждом push в репозиторий.', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Демо для руководителя', 'Готовим показ основных сценариев: вход, задачи, новости, админка.', 2, NOW());

INSERT INTO logs (user_id, action, description, created_at) VALUES
(1, 'login', 'Пользователь вошел в систему', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 'task_created', 'Создана задача ''Оформить главную страницу''', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 'news_created', 'Создана новость ''План на неделю''', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 'user_created', 'Создан пользователь ''user3@example.com''', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(5, 'status_changed', 'Изменен статус задачи ''Наполнить ленту новостей'' на ''completed''', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'task_updated', 'Обновлена задача ''Настроить CI на GitHub''', DATE_SUB(NOW(), INTERVAL 2 DAY));
