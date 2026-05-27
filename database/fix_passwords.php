<?php
/**
 * Одноразовое исправление паролей тестовых аккаунтов.
 * Запуск из терминала (из корня проекта):
 *   php database/fix_passwords.php
 */
declare(strict_types=1);

$configPath = dirname(__DIR__) . '/backend/config/database.php';
if (!is_file($configPath)) {
    fwrite(STDERR, "Не найден файл настроек.\n");
    exit(1);
}

$config = require $configPath;
$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
    $config['host'],
    $config['port'],
    $config['dbname'],
    $config['charset']
);

try {
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    fwrite(STDERR, "Ошибка подключения к MySQL: " . $e->getMessage() . "\n");
    exit(1);
}

$accounts = [
    ['admin@example.com', 'admin123'],
    ['user@example.com', 'user123'],
    ['user2@example.com', 'user123'],
    ['user3@example.com', 'user123'],
    ['user4@example.com', 'user123'],
    ['user5@example.com', 'user123'],
];

$stmt = $pdo->prepare('UPDATE users SET password = :password WHERE email = :email');
$updated = 0;

foreach ($accounts as [$email, $plain]) {
    $stmt->execute([
        ':password' => password_hash($plain, PASSWORD_DEFAULT),
        ':email' => $email,
    ]);
    if ($stmt->rowCount() > 0) {
        $updated++;
        echo "Обновлён: {$email}\n";
    } else {
        echo "Не найден в БД: {$email}\n";
    }
}

$count = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
echo "\nПользователей в базе: {$count}\n";
echo "Готово. Вход: admin@example.com / admin123\n";
