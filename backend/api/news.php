<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';
$user = requireAuth(); $method = $_SERVER['REQUEST_METHOD']; $input = readJsonBody(); $pdo = Database::getConnection();
if ($method === 'GET') { $stmt = $pdo->query('SELECT n.*, u.full_name AS author_name FROM news n LEFT JOIN users u ON u.id = n.author_id ORDER BY n.created_at DESC'); jsonResponse(true, $stmt->fetchAll()); }
if ($method === 'POST') {
    $title = trim((string) ($input['title'] ?? '')); $content = trim((string) ($input['content'] ?? ''));
    if ($title === '' || $content === '') jsonResponse(false, null, 'Заполните поля', 400);
    $stmt = $pdo->prepare('INSERT INTO news (title, content, author_id) VALUES (:title, :content, :author_id)');
    $stmt->execute([':title' => $title, ':content' => $content, ':author_id' => $user['id']]);
    logAction($user['id'], 'news_created', "Создана новость '{$title}'"); jsonResponse(true, ['id' => (int) $pdo->lastInsertId()], '', 201);
}
if ($method === 'DELETE') {
    if ($user['role'] !== 'admin') jsonResponse(false, null, 'Только администратор может удалять новости', 403);
    $id = (int) ($_GET['id'] ?? 0); $stmt = $pdo->prepare('DELETE FROM news WHERE id = :id'); $stmt->execute([':id' => $id]);
    logAction($user['id'], 'news_deleted', "Удалена новость #{$id}"); jsonResponse(true, ['deleted' => true]);
}
jsonResponse(false, null, 'Маршрут не найден', 404);
