<?php
declare(strict_types=1);

/**
 * ВРЕМЕННЫЙ файл — удалите после использования!
 * Откройте в браузере один раз:
 * http://localhost:8000/backend/api/dev_reset_passwords.php?key=portal2026
 */
require_once __DIR__ . '/../core/bootstrap.php';

if (($_GET['key'] ?? '') !== 'portal2026') {
    jsonResponse(false, null, 'Доступ запрещён', 403);
}

$pdo = Database::getConnection();
$accounts = [
    ['admin@example.com', 'admin123'],
    ['user@example.com', 'user123'],
    ['user2@example.com', 'user123'],
    ['user3@example.com', 'user123'],
    ['user4@example.com', 'user123'],
    ['user5@example.com', 'user123'],
];

$stmt = $pdo->prepare('UPDATE users SET password = :password WHERE email = :email');
$results = [];

foreach ($accounts as [$email, $plain]) {
    $stmt->execute([
        ':password' => password_hash($plain, PASSWORD_DEFAULT),
        ':email' => $email,
    ]);
    $results[] = [
        'email' => $email,
        'updated' => $stmt->rowCount() > 0,
    ];
}

$userCount = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();

jsonResponse(true, [
    'message' => 'Пароли обновлены. Попробуйте войти: admin@example.com / admin123',
    'users_in_db' => $userCount,
    'details' => $results,
    'next_step' => 'Удалите файл backend/api/dev_reset_passwords.php',
]);
