/* Письмо оператору с заявкой на проверку сайта. Табличная вёрстка и инлайновые
   стили — не архаизм: почтовые клиенты режут <style> и flex/grid, поэтому иначе
   письмо развалится. Есть PHP-близнец: public/api/data/lead-email.php (тот же
   шаблон для хостинга) — правки вносить в оба файла. */

const LINK = 'color:#8f2f26;text-decoration:underline;'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(date)
  return `${parts} (МСК)`
}

// Адрес сайта ссылкой: клиент пишет «example.ru», браузеру нужна схема.
function siteHtml(raw) {
  const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    new URL(href)
  } catch {
    return escapeHtml(raw)
  }
  return `<a href="${escapeHtml(href)}" style="${LINK}">${escapeHtml(raw)}</a>`
}

// Контакт ссылкой: почта — mailto:, телефон — tel:, ник в Telegram — t.me.
function contactHtml(raw) {
  const text = escapeHtml(raw)
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return `<a href="mailto:${text}" style="${LINK}">${text}</a>`
  }
  if (/^[+\d\s()\-.]+$/.test(raw)) {
    return `<a href="tel:${raw.replace(/[^+\d]/g, '')}" style="${LINK}">${text}</a>`
  }
  const nick = raw.match(/^@?([a-zA-Z][a-zA-Z0-9_]{4,31})$/)
  if (nick) return `<a href="https://t.me/${nick[1]}" style="${LINK}">${text}</a>`
  return text
}

const row = (label, valueHtml) => `
          <tr>
            <td style="padding:0 0 4px;color:#7a6f6c;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${label}</td>
          </tr>
          <tr>
            <td style="padding:0 0 18px;color:#231a18;font-size:16px;line-height:1.5;">${valueHtml}</td>
          </tr>`

/**
 * @param {{ site: string, contact: string, name?: string, kind?: string }} data
 */
export function buildLeadEmailHtml(data) {
  const rows =
    row('Адрес сайта', siteHtml(data.site)) +
    row('Контакт', contactHtml(data.contact)) +
    row('Имя', escapeHtml(data.name || '—')) +
    row('Что проверяем', escapeHtml(data.kind || '—')) +
    row('Получено', escapeHtml(formatDate()))

  return `<!DOCTYPE html>
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
${rows}
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
</html>`
}
