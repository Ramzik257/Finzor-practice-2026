<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';

$u = requireAuth();
$pdo = Database::getConnection();

$stats = [
    'total' => (int) $pdo->query('SELECT COUNT(*) FROM tasks')->fetchColumn(),
    'completed' => (int) $pdo->query("SELECT COUNT(*) FROM tasks WHERE status='completed'")->fetchColumn(),
    'in_progress' => (int) $pdo->query("SELECT COUNT(*) FROM tasks WHERE status='in_progress'")->fetchColumn(),
    'pending' => (int) $pdo->query("SELECT COUNT(*) FROM tasks WHERE status='pending'")->fetchColumn(),
    'news' => (int) $pdo->query('SELECT COUNT(*) FROM news')->fetchColumn(),
    'users' => (int) $pdo->query('SELECT COUNT(*) FROM users WHERE is_blocked = 0')->fetchColumn(),
];

$news = $pdo->query(
    'SELECT n.title, n.created_at, u.full_name AS author_name
     FROM news n
     LEFT JOIN users u ON u.id = n.author_id
     ORDER BY n.created_at DESC LIMIT 5'
)->fetchAll();

$stmt = $pdo->prepare(
    'SELECT title, status, deadline
     FROM tasks
     WHERE creator_id = :id OR assignee_id = :id
     ORDER BY created_at DESC LIMIT 6'
);
$stmt->execute([':id' => $u['id']]);

jsonResponse(true, [
    'user_name' => $_SESSION['full_name'] ?? '',
    'stats' => $stats,
    'latest_news' => $news,
    'my_tasks' => $stmt->fetchAll(),
]);
