<?php

declare(strict_types=1);

/**
 * Письмо оператору с заявкой на проверку сайта. Вёрстка таблицами и инлайновые
 * стили — почтовые клиенты режут <style>, flex и grid. Есть JS-близнец:
 * server/emailTemplate.js (тот же шаблон для Node API) — правки вносить в оба.
 */
function leadEscape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

const LEAD_LINK = 'color:#8f2f26;text-decoration:underline;';

/** Адрес сайта ссылкой: клиент пишет «example.ru», браузеру нужна схема. */
function leadSiteHtml(string $raw): string
{
    $href = preg_match('~^https?://~i', $raw) ? $raw : 'https://' . $raw;
    if (!filter_var($href, FILTER_VALIDATE_URL)) {
        return leadEscape($raw);
    }

    return '<a href="' . leadEscape($href) . '" style="' . LEAD_LINK . '">' . leadEscape($raw) . '</a>';
}

/** Контакт ссылкой: почта — mailto:, телефон — tel:, ник в Telegram — t.me. */
function leadContactHtml(string $raw): string
{
    $text = leadEscape($raw);

    if (filter_var($raw, FILTER_VALIDATE_EMAIL)) {
        return '<a href="mailto:' . $text . '" style="' . LEAD_LINK . '">' . $text . '</a>';
    }
    if (preg_match('/^[+\d\s()\-.]+$/', $raw)) {
        $tel = leadEscape(preg_replace('/[^+\d]/', '', $raw));

        return '<a href="tel:' . $tel . '" style="' . LEAD_LINK . '">' . $text . '</a>';
    }
    if (preg_match('/^@?([a-zA-Z][a-zA-Z0-9_]{4,31})$/', $raw, $m)) {
        return '<a href="https://t.me/' . $m[1] . '" style="' . LEAD_LINK . '">' . $text . '</a>';
    }

    return $text;
}

function leadRow(string $label, string $valueHtml): string
{
    return <<<HTML
          <tr>
            <td style="padding:0 0 4px;color:#7a6f6c;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">{$label}</td>
          </tr>
          <tr>
            <td style="padding:0 0 18px;color:#231a18;font-size:16px;line-height:1.5;">{$valueHtml}</td>
          </tr>
HTML;
}

/**
 * @param array{site: string, contact: string, name?: string, kind?: string, date?: string} $fields
 */
function renderLeadEmail(array $fields): string
{
    $rows = leadRow('Адрес сайта', leadSiteHtml((string) $fields['site']))
        . leadRow('Контакт', leadContactHtml((string) $fields['contact']))
        . leadRow('Имя', leadEscape(($fields['name'] ?? '') ?: '—'))
        . leadRow('Что проверяем', leadEscape(($fields['kind'] ?? '') ?: '—'))
        . leadRow('Получено', leadEscape($fields['date'] ?? ''));

    return <<<HTML
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Заявка на проверку сайта</title>
</head>
<body style="margin:0;padding:24px 12px;background:#f7f3f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fdfbfa;border:2px solid #231a18;border-radius:8px;">
    <tr>
      <td style="padding:20px 24px;border-bottom:1px solid #d8cfcd;background:#f2ecea;border-radius:6px 6px 0 0;">
        <div style="color:#8f2f26;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Проверка сайтов</div>
        <div style="margin-top:6px;color:#231a18;font-size:22px;font-weight:700;line-height:1.25;">Новая заявка на проверку сайта</div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 24px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
{$rows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 24px;border-top:1px solid #d8cfcd;color:#7a6f6c;font-size:12px;line-height:1.5;">
        Заявка отправлена с формы на сайте. Отправляя форму, клиент согласился с обработкой персональных данных и политикой конфиденциальности.
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}
