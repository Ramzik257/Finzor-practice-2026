<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';
$u = requireAuth(); $pdo = Database::getConnection();
$stats = [
    'total' => (int) $pdo->query('SELECT COUNT(*) FROM tasks')->fetchColumn(),
    'completed' => (int) $pdo->query("SELECT COUNT(*) FROM tasks WHERE status='completed'")->fetchColumn(),
    'in_progress' => (int) $pdo->query("SELECT COUNT(*) FROM tasks WHERE status='in_progress'")->fetchColumn(),
];
$news = $pdo->query('SELECT n.title, u.full_name AS author_name FROM news n LEFT JOIN users u ON u.id = n.author_id ORDER BY n.created_at DESC LIMIT 3')->fetchAll();
$stmt = $pdo->prepare('SELECT title, status FROM tasks WHERE creator_id = :id OR assignee_id = :id ORDER BY created_at DESC LIMIT 5');
$stmt->execute([':id' => $u['id']]);
jsonResponse(true, ['stats' => $stats, 'latest_news' => $news, 'my_tasks' => $stmt->fetchAll()]);
