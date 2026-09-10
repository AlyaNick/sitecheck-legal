<?php

declare(strict_types=1);

/**
 * Настройки обработчика заявок. Читаются из .env — файла с теми же ключами,
 * что и у сборки (см. .env.example, раздел «Почта»).
 *
 * Где ищем .env (каждый следующий найденный перекрывает предыдущий):
 *   1) на уровень выше корня сайта — локально это корень репозитория,
 *      на хостинге сюда можно вынести секрет из веб-каталога;
 *   2) корень сайта, рядом с index.html — сюда его кладёт npm run build;
 *   3) сам каталог api/.
 *
 * Пароли в репозиторий не попадают: .env в .gitignore, а по HTTP его
 * закрывает public/.htaccess.
 */
require __DIR__ . '/loadEnv.php';

loadEnvFile(dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env');
loadEnvFile(dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env');
loadEnvFile(__DIR__ . DIRECTORY_SEPARATOR . '.env');

$env = static function (string $key, string $default = ''): string {
    $value = getenv($key);

    return $value === false || trim($value) === '' ? $default : trim($value);
};

return [
    // Ящик, куда приходят заявки. Он же логин SMTP и адрес отправителя.
    'email' => $env('OPERATOR_EMAIL'),
    // Пароль приложения почтового провайдера (не пароль от аккаунта).
    'password' => $env('YANDEX_APP_PASSWORD'),
    'smtp_host' => $env('SMTP_HOST', 'smtp.yandex.ru'),
    'smtp_port' => (int) $env('SMTP_PORT', '465'),
    // Имя отправителя в поле From.
    'from_name' => $env('VITE_ORG_BRAND', 'Заявка с сайта'),
];
