<?php

declare(strict_types=1);

/**
 * Минимальный SMTP-клиент: SSL-сокет на 465 порт, AUTH PLAIN с откатом на
 * AUTH LOGIN, одно HTML-письмо. Без зависимостей — на хостинге нет Composer.
 * Проверен с smtp.yandex.ru и smtp.mail.ru.
 */

/** Читает ответ сервера целиком, включая многострочные (RFC 5321). */
function smtp_read_response($sock): string
{
    $buffer = '';
    $max = 64;
    while (--$max > 0) {
        $line = fgets($sock, 8192);
        if ($line === false) {
            break;
        }
        $buffer .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }

    return $buffer;
}

function smtp_connect_ssl(string $host, int $port): array
{
    $ctx = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);

    $sock = @stream_socket_client(
        "ssl://$host:$port",
        $errno,
        $errstr,
        30,
        STREAM_CLIENT_CONNECT,
        $ctx
    );

    if ($sock) {
        stream_set_timeout($sock, 30);
    }

    return [$sock, $errno, $errstr];
}

/** @return true|string true при успехе, иначе строка ответа сервера */
function smtp_auth_plain($sock, string $user, string $pass)
{
    fputs($sock, 'AUTH PLAIN ' . base64_encode("\0" . $user . "\0" . $pass) . "\r\n");
    $line = trim(smtp_read_response($sock));

    return substr($line, 0, 3) === '235' ? true : $line;
}

/** @return true|string */
function smtp_auth_login($sock, string $user, string $pass)
{
    fputs($sock, "AUTH LOGIN\r\n");
    smtp_read_response($sock);
    fputs($sock, base64_encode($user) . "\r\n");
    smtp_read_response($sock);
    fputs($sock, base64_encode($pass) . "\r\n");
    $line = trim(smtp_read_response($sock));

    return substr($line, 0, 3) === '235' ? true : $line;
}

/**
 * Отправляет одно HTML-письмо.
 *
 * @return true|string true при успехе, иначе текст ошибки для ответа клиенту
 */
function smtpSend(
    string $host,
    int $port,
    string $user,
    string $pass,
    string $from,
    string $to,
    string $subject,
    string $htmlBody,
    string $fromName = 'Заявка с сайта',
    ?string $replyTo = null
) {
    [$sock, $errno, $errstr] = smtp_connect_ssl($host, $port);
    if (!$sock) {
        return "Connection failed: $errstr ($errno)";
    }

    $greet = trim(smtp_read_response($sock));
    if (substr($greet, 0, 3) !== '220') {
        fclose($sock);

        return 'Bad greeting: ' . $greet;
    }

    $ehloHost = preg_replace('/[^\w.-]+/', '', (string) gethostname()) ?: 'localhost';
    fputs($sock, "EHLO $ehloHost\r\n");
    smtp_read_response($sock);

    $auth = smtp_auth_plain($sock, $user, $pass);
    if ($auth !== true) {
        // Некоторые серверы не принимают PLAIN — пробуем LOGIN на новом соединении.
        $plainError = $auth;
        fclose($sock);

        [$sock, $errno, $errstr] = smtp_connect_ssl($host, $port);
        if (!$sock) {
            return "Connection failed (retry): $errstr ($errno)";
        }
        smtp_read_response($sock);
        fputs($sock, "EHLO $ehloHost\r\n");
        smtp_read_response($sock);

        $auth = smtp_auth_login($sock, $user, $pass);
        if ($auth !== true) {
            fclose($sock);

            return 'Auth failed: ' . $auth . ' (PLAIN: ' . $plainError . ')';
        }
    }

    fputs($sock, "MAIL FROM:<$from>\r\n");
    smtp_read_response($sock);

    fputs($sock, "RCPT TO:<$to>\r\n");
    smtp_read_response($sock);

    fputs($sock, "DATA\r\n");
    smtp_read_response($sock);

    $replyTo = $replyTo ?: $from;

    // Заголовки с не-ASCII кодируем по RFC 2047; тело — base64, чтобы не
    // зависеть от переносов строк и длины строк в HTML.
    $msg = 'From: =?UTF-8?B?' . base64_encode($fromName) . "?= <$from>\r\n";
    $msg .= "To: <$to>\r\n";
    $msg .= "Reply-To: <$replyTo>\r\n";
    $msg .= 'Subject: =?UTF-8?B?' . base64_encode($subject) . "?=\r\n";
    $msg .= 'Date: ' . date('r') . "\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n";
    $msg .= "\r\n";
    $msg .= chunk_split(base64_encode($htmlBody));
    $msg .= "\r\n.\r\n";

    fputs($sock, $msg);
    $resp = trim(smtp_read_response($sock));

    fputs($sock, "QUIT\r\n");
    fclose($sock);

    return substr($resp, 0, 3) === '250' ? true : 'Send failed: ' . $resp;
}
