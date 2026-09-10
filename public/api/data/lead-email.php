<?php

declare(strict_types=1);

/**
 * Письмо с заявкой. Вёрстка таблицами и инлайновые стили — почтовые клиенты
 * не понимают ни grid, ни внешний CSS. Есть JS-близнец: server/emailTemplate.js
 * (тот же шаблон для Node API) — правки нужно вносить в оба файла.
 */
function leadEscape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function renderLeadEmail(array $fields): string
{
    $rawContact = (string) ($fields['contact'] ?? '');

    $name = leadEscape($fields['name'] ?? '');
    $contact = leadEscape($rawContact);
    $topic = leadEscape(($fields['topic'] ?? '') ?: '—');
    $task = nl2br(leadEscape(($fields['task'] ?? '') ?: '—'));
    $marketing = !empty($fields['marketing']) ? 'да' : 'нет';
    $date = leadEscape($fields['date'] ?? '');

    // Кликабельный контакт: почта — mailto:, телефон — tel:, ник оставляем текстом.
    $contactHtml = $contact;
    if (filter_var($rawContact, FILTER_VALIDATE_EMAIL)) {
        $contactHtml = '<a href="mailto:' . $contact . '" style="color:#C4FA3B;text-decoration:none;">' . $contact . '</a>';
    } elseif ($rawContact !== '' && preg_match('/^[+\d\s()\-.]+$/', $rawContact)) {
        $tel = leadEscape(preg_replace('/[^+\d]/', '', $rawContact));
        $contactHtml = '<a href="tel:' . $tel . '" style="color:#C4FA3B;text-decoration:none;">' . $contact . '</a>';
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Новая заявка с сайта</title>
</head>
<body style="margin:0;padding:0;background:#0B0C0A;font-family:Arial,Helvetica,sans-serif;color:#F4F6F1;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0B0C0A;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#141712;border:1px solid #23261F;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:#1A1D16;border-bottom:1px solid #23261F;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#C4FA3B;">Питч Студио</div>
              <h1 style="margin:12px 0 0;font-size:26px;line-height:1.15;color:#F4F6F1;">Новая заявка с сайта</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:0 0 14px;color:#8A8F84;font-size:14px;width:170px;vertical-align:top;">Имя</td>
                  <td style="padding:0 0 14px;color:#F4F6F1;font-size:16px;font-weight:600;">{$name}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;color:#8A8F84;font-size:14px;vertical-align:top;">Контакт</td>
                  <td style="padding:0 0 14px;color:#F4F6F1;font-size:16px;font-weight:600;">{$contactHtml}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;color:#8A8F84;font-size:14px;vertical-align:top;">Задача</td>
                  <td style="padding:0 0 14px;color:#F4F6F1;font-size:16px;">{$topic}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;color:#8A8F84;font-size:14px;vertical-align:top;">Комментарий</td>
                  <td style="padding:0 0 14px;color:#F4F6F1;font-size:16px;line-height:1.5;">{$task}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;color:#8A8F84;font-size:13px;vertical-align:top;">Рассылка</td>
                  <td style="padding:0 0 14px;color:#8A8F84;font-size:13px;">{$marketing}</td>
                </tr>
                <tr>
                  <td style="padding:0;color:#8A8F84;font-size:13px;vertical-align:top;">Дата</td>
                  <td style="padding:0;color:#8A8F84;font-size:13px;">{$date}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#111309;border-top:1px solid #23261F;color:#8A8F84;font-size:12px;line-height:1.5;">
              Согласие на обработку персональных данных дано отправкой формы (пп. 5.1 и 6.1 Политики).
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}
