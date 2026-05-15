<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';

$user = requireAuth();
$method = $_SERVER['REQUEST_METHOD'];
$input = readJsonBody();
$pdo = Database::getConnection();

if ($method === 'GET') {
    $where = [];
    $params = [];
    if (!empty($_GET['status'])) {$where[] = 't.status = :status'; $params[':status'] = $_GET['status'];}
    if (!empty($_GET['assignee_id'])) {$where[] = 't.assignee_id = :assignee'; $params[':assignee'] = (int) $_GET['assignee_id'];}
    if (!empty($_GET['priority'])) {$where[] = 't.priority = :priority'; $params[':priority'] = $_GET['priority'];}
    if (!empty($_GET['deadline'])) {$where[] = 'DATE(t.deadline) = :deadline'; $params[':deadline'] = $_GET['deadline'];}
    if (!empty($_GET['search'])) {$where[] = '(t.title LIKE :search OR t.description LIKE :search)'; $params[':search'] = '%' . trim((string) $_GET['search']) . '%';}
    $sql = 'SELECT t.*, c.full_name AS creator_name, a.full_name AS assignee_name FROM tasks t LEFT JOIN users c ON c.id = t.creator_id LEFT JOIN users a ON a.id = t.assignee_id';
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY t.created_at DESC';
    $stmt = $pdo->prepare($sql); $stmt->execute($params); jsonResponse(true, $stmt->fetchAll());
}

if ($method === 'POST') {
    $title = trim((string) ($input['title'] ?? ''));
    if ($title === '') jsonResponse(false, null, 'Заголовок обязателен', 400);
    $stmt = $pdo->prepare('INSERT INTO tasks (title, description, creator_id, assignee_id, deadline, status, priority) VALUES (:title, :description, :creator_id, :assignee_id, :deadline, :status, :priority)');
    $stmt->execute([
        ':title' => $title, ':description' => trim((string) ($input['description'] ?? '')), ':creator_id' => $user['id'],
        ':assignee_id' => !empty($input['assignee_id']) ? (int) $input['assignee_id'] : null, ':deadline' => !empty($input['deadline']) ? $input['deadline'] : null,
        ':status' => in_array(($input['status'] ?? ''), ['pending', 'in_progress', 'completed'], true) ? $input['status'] : 'pending',
        ':priority' => in_array(($input['priority'] ?? ''), ['low', 'medium', 'high'], true) ? $input['priority'] : 'medium',
    ]);
    logAction($user['id'], 'task_created', "Создана задача '{$title}'");
    jsonResponse(true, ['id' => (int) $pdo->lastInsertId()], '', 201);
}

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? 0);
    $stmt = $pdo->prepare('SELECT * FROM tasks WHERE id = :id LIMIT 1'); $stmt->execute([':id' => $id]); $task = $stmt->fetch();
    if (!$task) jsonResponse(false, null, 'Задача не найдена', 404);
    if (($input['action'] ?? '') === 'change_status') {
        $status = (string) ($input['status'] ?? '');
        $stmt = $pdo->prepare('UPDATE tasks SET status = :status WHERE id = :id');
        $stmt->execute([':status' => $status, ':id' => $id]);
        logAction($user['id'], 'status_changed', "Изменен статус задачи '{$task['title']}' на '{$status}'");
        jsonResponse(true, ['updated' => true]);
    }
    if ($user['role'] !== 'admin' && (int) $task['creator_id'] !== $user['id']) jsonResponse(false, null, 'Недостаточно прав', 403);
    $stmt = $pdo->prepare('UPDATE tasks SET title=:title, description=:description, assignee_id=:assignee_id, deadline=:deadline, status=:status, priority=:priority WHERE id=:id');
    $stmt->execute([
        ':id' => $id, ':title' => trim((string) ($input['title'] ?? $task['title'])), ':description' => trim((string) ($input['description'] ?? $task['description'])),
        ':assignee_id' => !empty($input['assignee_id']) ? (int) $input['assignee_id'] : null, ':deadline' => !empty($input['deadline']) ? $input['deadline'] : null,
        ':status' => $input['status'] ?? $task['status'], ':priority' => $input['priority'] ?? $task['priority'],
    ]);
    logAction($user['id'], 'task_updated', "Обновлена задача '{$task['title']}'");
    jsonResponse(true, ['updated' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    $stmt = $pdo->prepare('SELECT * FROM tasks WHERE id = :id LIMIT 1'); $stmt->execute([':id' => $id]); $task = $stmt->fetch();
    if (!$task) jsonResponse(false, null, 'Задача не найдена', 404);
    if ($user['role'] !== 'admin' && (int) $task['creator_id'] !== $user['id']) jsonResponse(false, null, 'Недостаточно прав', 403);
    $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = :id'); $stmt->execute([':id' => $id]);
    logAction($user['id'], 'task_deleted', "Удалена задача '{$task['title']}'");
    jsonResponse(true, ['deleted' => true]);
}

jsonResponse(false, null, 'Маршрут не найден', 404);
