<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';

requireAuth();
$pdo = Database::getConnection();

$stmt = $pdo->query(
    'SELECT id, full_name, email FROM users WHERE is_blocked = 0 ORDER BY full_name ASC'
);
jsonResponse(true, $stmt->fetchAll());
