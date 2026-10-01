<?php

declare(strict_types=1);

/**
 * Приём заявки на проверку сайта: POST JSON → письмо оператору по SMTP.
 *
 *   Вход:  { site, contact, name?, kind? }
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

/** Текстовое поле формы: строка без тегов и крайних пробелов, не длиннее $max. */
function field(array $input, string $key, int $max): string
{
    $value = trim(strip_tags((string) ($input[$key] ?? '')));
    if (preg_match('/^.{0,' . $max . '}/us', $value, $m)) {
        $value = $m[0];
    }

    return $value;
}

// Названия для kind приходят с формы; здесь только подпись для письма.
const KINDS = [
    'pd' => 'Проверка по 152-ФЗ',
    'info' => 'Проверка по 168-ФЗ',
    'complex' => 'Комплексная проверка',
    'other' => 'Другой запрос',
];

/** Длина в символах без mbstring: считаем байты, кроме продолжений UTF-8. */
function utf8Length(string $value): int
{
    return strlen(preg_replace('/[\x80-\xBF]/', '', $value));
}

/**
 * Та же проверка, что и в server/index.js: телефон — от 10 цифр, иначе
 * достаточно букв (ник в мессенджере, почта).
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

$site = field($input, 'site', 300);
$contact = field($input, 'contact', 200);
$name = field($input, 'name', 200);
$kind = KINDS[(string) ($input['kind'] ?? '')] ?? KINDS['complex'];

if ($site === '' || !isCallableContact($contact)) {
    respond(400, ['error' => 'Укажите адрес сайта и телефон, Telegram или почту']);
}

date_default_timezone_set('Europe/Moscow');

$html = renderLeadEmail([
    'site' => $site,
    'contact' => $contact,
    'name' => $name,
    'kind' => $kind,
    'date' => date('d.m.Y, H:i') . ' (МСК)',
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
    'Проверка сайтов',
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
