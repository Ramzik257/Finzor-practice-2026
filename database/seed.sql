USE corp_portal;

INSERT INTO users (email, password, full_name, role) VALUES
('admin@example.com', '$2y$10$3m0r6nMdaWfN3hO3Y5fYKe8S7f9M7cV95PPApQN5ti2WTRwMABe5G', 'Администратор', 'admin'),
('user@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Иван Иванов', 'employee'),
('user2@example.com', '$2y$10$hRJtI6kN4qkX5CuvM5m3ruU0M4C8Wf5rIFf65hYik7FVVEyl1wcBS', 'Петр Петров', 'employee');

INSERT INTO tasks (title, description, creator_id, assignee_id, deadline, status, priority) VALUES
('Подготовить UI kit', 'Сделать переиспользуемые компоненты', 1, 2, DATE_ADD(NOW(), INTERVAL 3 DAY), 'in_progress', 'high'),
('Настроить авторизацию', 'Реализовать login/logout через sessions', 1, 3, DATE_ADD(NOW(), INTERVAL 2 DAY), 'pending', 'high'),
('Наполнить ленту', 'Добавить стартовые новости', 2, 2, DATE_ADD(NOW(), INTERVAL 4 DAY), 'completed', 'medium');

INSERT INTO news (title, content, author_id) VALUES
('Запуск портала', 'Мы запустили первую версию портала.', 1),
('Обновление дизайна', 'Добавлены карточки и анимации.', 2),
('План на неделю', 'Фокус на API и мобильной версии.', 3);
