// Локальный API отправки заявок: тот же маршрут и тот же результат, что и у
// PHP-эндпоинта в public/api/send.php, только через nodemailer. Нужен для
// `npm run dev` (PHP на машине может не быть) и для запуска на Node-хостинге.
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import express from 'express'
import nodemailer from 'nodemailer'

import { buildLeadEmailHtml } from './emailTemplate.js'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '..', 'dist')

const port = Number(process.env.PORT || 3001)
const operatorEmail = (process.env.OPERATOR_EMAIL || '').trim()
const appPassword = (process.env.YANDEX_APP_PASSWORD || '').trim()
const smtpHost = (process.env.SMTP_HOST || 'smtp.yandex.ru').trim()
const smtpPort = Number(process.env.SMTP_PORT || 465)
// Имя отправителя в списке писем — что за заявка, а не бренд лендинга.
const fromName = 'Проверка сайтов'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d\s()\-.]+$/

// Названия для kind приходят с формы; здесь только подпись для письма.
const KINDS = {
  pd: 'Проверка по 152-ФЗ',
  info: 'Проверка по 168-ФЗ',
  complex: 'Комплексная проверка',
  other: 'Другой запрос',
}

// Та же проверка, что и на клиенте: телефон — по количеству цифр, ник и почта —
// по наличию букв. Иначе «+7» из плейсхолдера проходит как валидный контакт.
function isCallableContact(value) {
  if (value.length < 3) return false
  if (PHONE_RE.test(value)) return value.replace(/\D/g, '').length >= 10
  return /[a-zA-Zа-яА-Я]/.test(value)
}

const app = express()
app.use(express.json({ limit: '64kb' }))

app.post('/api/send.php', async (req, res) => {
  if (!operatorEmail || !appPassword) {
    return res.status(500).json({
      error: 'Почта не настроена: заполните OPERATOR_EMAIL и YANDEX_APP_PASSWORD в .env',
    })
  }

  const site = String(req.body?.site ?? '').trim().slice(0, 300)
  const contact = String(req.body?.contact ?? '').trim().slice(0, 200)
  const name = String(req.body?.name ?? '').trim().slice(0, 200)
  const kind = KINDS[String(req.body?.kind ?? '')] || KINDS.complex

  if (!site || !isCallableContact(contact)) {
    return res.status(400).json({
      error: 'Укажите адрес сайта и телефон, Telegram или почту',
    })
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: operatorEmail, pass: appPassword },
  })

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${operatorEmail}>`,
      to: operatorEmail,
      // Телефон или ник в Reply-To сломают «ответить» в почтовом клиенте.
      replyTo: EMAIL_RE.test(contact) ? contact : operatorEmail,
      subject: 'Проверка сайтов',
      html: buildLeadEmailHtml({ site, contact, name, kind }),
    })
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'Не удалось отправить письмо. Проверьте SMTP_HOST и пароль приложения в .env.',
      detail: error?.message || String(error),
    })
  }
})

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  // SPA-фолбэк как middleware, а не app.get('*'): в Express 5 строка '*'
  // больше не валидный путь и роняет процесс на старте.
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Mail API: http://127.0.0.1:${port}/api/send.php`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Порт ${port} занят. Закройте предыдущий npm run dev или задайте другой PORT в .env`)
    process.exit(1)
  }
  console.error(error)
  process.exit(1)
})
