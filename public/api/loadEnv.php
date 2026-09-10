<?php

declare(strict_types=1);

/**
 * Подгружает переменные из .env в getenv() / $_ENV (без Composer).
 * Формат: KEY=value, строки с # — комментарии, кавычки вокруг значения снимаются.
 * Файла нет — молча ничего не делает.
 */
function loadEnvFile(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        return;
    }

    foreach (preg_split("/\r\n|\n|\r/", $raw) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        if (!preg_match('/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/', $line, $m)) {
            continue;
        }
        $key = $m[1];
        $val = trim($m[2]);
        if ($val !== '' && ($val[0] === '"' || $val[0] === "'")) {
            $val = trim($val, $val[0]);
        }
        putenv("$key=$val");
        $_ENV[$key] = $val;
    }
}
