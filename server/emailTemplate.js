/* Письмо оператору. Табличная вёрстка и инлайновые стили — не архаизм: почтовые
   клиенты режут <style> и flex/grid, поэтому иначе письмо развалится. */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Moscow',
  }).format(date)
}

/**
 * @param {{ site: string, contact: string, name?: string, kind?: string }} data
 */
export function buildLeadEmailHtml(data) {
  const site = escapeHtml(data.site)
  const contact = escapeHtml(data.contact)
  const name = escapeHtml(data.name || '—')
  const kind = escapeHtml(data.kind || '—')
  const when = escapeHtml(formatDate())

  const row = (label, value) => `
    <tr>
      <td style="padding:0 0 4px;color:#8a7f7c;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${label}</td>
    </tr>
    <tr>
      <td style="padding:0 0 16px;color:#231a18;font-size:16px;line-height:1.5;">${value}</td>
    </tr>`

  return `<!doctype html>
<html lang="ru">
<body style="margin:0;padding:24px;background:#f7f3f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fdfbfa;border:2px solid #231a18;border-radius:8px;">
    <tr>
      <td style="padding:20px 24px;border-bottom:1px solid #d8cfcd;background:#f2ecea;">
        <span style="color:#8f2f26;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Заявка на проверку сайта</span>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Адрес сайта', site)}
          ${row('Контакт', contact)}
          ${row('Имя', name)}
          ${row('Что проверяем', kind)}
          ${row('Получено', when)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
