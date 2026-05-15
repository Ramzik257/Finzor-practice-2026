<?php
declare(strict_types=1);
require_once __DIR__ . '/../core/bootstrap.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    $input = readJsonBody();

    if ($method === 'POST' && $action === 'login') {
        $email = trim((string) ($input['email'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
            jsonResponse(false, null, 'Некорректные данные', 400);
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT id, email, password, full_name, role, is_blocked FROM users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            jsonResponse(false, null, 'Неверный email или пароль', 401);
        }
        if ((int) $user['is_blocked'] === 1) {
            jsonResponse(false, null, 'Пользователь заблокирован', 403);
        }

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['role'] = (string) $user['role'];
        $_SESSION['full_name'] = (string) $user['full_name'];
        logAction((int) $user['id'], 'login', 'Пользователь вошел в систему');
        jsonResponse(true, ['id' => (int) $user['id'], 'email' => $user['email'], 'full_name' => $user['full_name'], 'role' => $user['role']]);
    }

    if ($method === 'POST' && $action === 'logout') {
        $u = currentUser();
        if ($u) {
            logAction($u['id'], 'logout', 'Пользователь вышел');
        }
        $_SESSION = [];
        session_destroy();
        jsonResponse(true, ['message' => 'ok']);
    }

    if ($method === 'GET' && $action === 'me') {
        $u = requireAuth();
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT id, email, full_name, role, is_blocked FROM users WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $u['id']]);
        jsonResponse(true, $stmt->fetch());
    }

    jsonResponse(false, null, 'Маршрут не найден', 404);
} catch (Throwable $e) {
    error_log('auth.php error: ' . $e->getMessage());
    jsonResponse(false, null, 'Ошибка подключения к базе данных', 500);
}
