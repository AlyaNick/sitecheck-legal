<?php

declare(strict_types=1);

/**
 * Приём заявки с формы: POST JSON → письмо на почту студии по SMTP.
 *
 *   Вход:  { name, contact, topic?, task?, marketing? }
 *   Выход: { ok: true }  либо  { error: "текст для пользователя", detail?: "…" }
 *
 * Настройки — в .env рядом с index.html (см. config.php и .env.example).
 * В разработке этот же путь обслуживает Node: server/index.js.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Предупреждения PHP в теле ответа ломают JSON на клиенте.
ini_set('display_errors', '0');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Текстовое поле формы: строка без тегов и крайних пробелов. */
function field(array $input, string $key): string
{
    return trim(strip_tags((string) ($input[$key] ?? '')));
}

/** Длина в символах без mbstring: считаем байты, кроме продолжений UTF-8. */
function utf8Length(string $value): int
{
    return strlen(preg_replace('/[\x80-\xBF]/', '', $value));
}

/**
 * Та же проверка, что и на клиенте (isValidContact в ContactForm.vue):
 * телефон — от 10 цифр, иначе достаточно букв (ник в мессенджере, почта).
 */
function isCallableContact(string $value): bool
{
    if (utf8Length($value) < 3) {
        return false;
    }
    if (preg_match('/^[+\d\s()\-.]+$/', $value)) {
        return strlen(preg_replace('/\D/', '', $value)) >= 10;
    }

    return (bool) preg_match('/[a-zA-Zа-яА-Я]/u', $value);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/smtp.php';
require_once __DIR__ . '/data/lead-email.php';

if ($config['email'] === '' || $config['password'] === '') {
    respond(500, [
        'error' => 'Почта на сервере не настроена.',
        'detail' => 'Заполните OPERATOR_EMAIL и YANDEX_APP_PASSWORD в .env рядом с index.html.',
    ]);
}

$input = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($input)) {
    respond(400, ['error' => 'Неверный формат данных']);
}

$name = field($input, 'name');
$contact = field($input, 'contact');
$topic = field($input, 'topic');
$task = field($input, 'task');
$marketing = !empty($input['marketing']);

if (utf8Length($name) < 2 || !isCallableContact($contact)) {
    respond(400, ['error' => 'Укажите имя и телефон или ник в мессенджере']);
}

// Это письмо, а не файлопомойка: комментарий режем до 4000 символов.
if (utf8Length($task) > 4000 && preg_match('/^.{0,4000}/us', $task, $m)) {
    $task = $m[0];
}

$html = renderLeadEmail([
    'name' => $name,
    'contact' => $contact,
    'topic' => $topic,
    'task' => $task,
    'marketing' => $marketing,
    'date' => date('d.m.Y H:i'),
]);

// Reply-To ставим, только если контакт — почта: телефон или ник в этом
// заголовке сломают «Ответить» в почтовом клиенте.
$replyTo = filter_var($contact, FILTER_VALIDATE_EMAIL) ? $contact : null;

$result = smtpSend(
    $config['smtp_host'],
    $config['smtp_port'],
    $config['email'],
    $config['password'],
    $config['email'],
    $config['email'],
    'Заявка с сайта — ' . $name,
    $html,
    $config['from_name'],
    $replyTo
);

if ($result === true) {
    respond(200, ['ok' => true]);
}

respond(500, [
    'error' => 'Не удалось отправить письмо.',
    'detail' => $result,
]);
