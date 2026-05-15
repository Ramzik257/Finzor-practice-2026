<?php
declare(strict_types=1);

session_start();
date_default_timezone_set('Europe/Moscow');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../logs/php-error.log');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/Database.php';

function jsonResponse(bool $success, mixed $data = null, string $error = '', int $code = 200): void
{
    http_response_code($code);
    echo json_encode(['success' => $success, 'data' => $data, 'error' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function currentUser(): ?array
{
    if (!isset($_SESSION['user_id'], $_SESSION['role'])) return null;
    return ['id' => (int) $_SESSION['user_id'], 'role' => (string) $_SESSION['role'], 'full_name' => (string) ($_SESSION['full_name'] ?? '')];
}

function requireAuth(): array
{
    $user = currentUser();
    if (!$user) jsonResponse(false, null, 'Требуется авторизация', 401);
    return $user;
}

function requireAdmin(): array
{
    $user = requireAuth();
    if ($user['role'] !== 'admin') jsonResponse(false, null, 'Недостаточно прав', 403);
    return $user;
}

function logAction(?int $userId, string $action, string $description): void
{
    try {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO logs (user_id, action, description) VALUES (:user_id, :action, :description)');
        $stmt->execute([':user_id' => $userId, ':action' => $action, ':description' => $description]);
    } catch (Throwable $e) {
        error_log('Failed to write log action: ' . $e->getMessage());
    }
}
