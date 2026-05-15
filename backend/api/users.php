<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';
$admin = requireAdmin(); $method = $_SERVER['REQUEST_METHOD']; $input = readJsonBody(); $pdo = Database::getConnection();
if ($method === 'GET') { $stmt = $pdo->query('SELECT id, email, full_name, role, is_blocked, created_at FROM users ORDER BY created_at DESC'); jsonResponse(true, $stmt->fetchAll()); }
if ($method === 'POST') {
    $email = trim((string) ($input['email'] ?? '')); $password = (string) ($input['password'] ?? ''); $full = trim((string) ($input['full_name'] ?? ''));
    $role = in_array(($input['role'] ?? ''), ['admin', 'employee'], true) ? $input['role'] : 'employee';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) jsonResponse(false, null, 'Некорректные email/пароль', 400);
    $stmt = $pdo->prepare('INSERT INTO users (email, password, full_name, role) VALUES (:email, :password, :full_name, :role)');
    $stmt->execute([':email' => $email, ':password' => password_hash($password, PASSWORD_DEFAULT), ':full_name' => $full, ':role' => $role]);
    logAction($admin['id'], 'user_created', "Создан пользователь '{$email}'"); jsonResponse(true, ['id' => (int) $pdo->lastInsertId()], '', 201);
}
if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? 0); if ($id <= 0) jsonResponse(false, null, 'Некорректный ID', 400);
    $role = in_array(($input['role'] ?? ''), ['admin', 'employee'], true) ? $input['role'] : 'employee';
    $isBlocked = isset($input['is_blocked']) ? (int) (bool) $input['is_blocked'] : 0;
    $stmt = $pdo->prepare('UPDATE users SET role = :role, is_blocked = :is_blocked WHERE id = :id');
    $stmt->execute([':id' => $id, ':role' => $role, ':is_blocked' => $isBlocked]); jsonResponse(true, ['updated' => true]);
}
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0); if ($id === $admin['id']) jsonResponse(false, null, 'Нельзя удалить себя', 400);
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = :id'); $stmt->execute([':id' => $id]); jsonResponse(true, ['deleted' => true]);
}
jsonResponse(false, null, 'Маршрут не найден', 404);
