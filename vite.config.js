import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const here = dirname(fileURLToPath(import.meta.url))

/* Реквизиты организации и адрес сайта — из окружения, в одном месте.

   Слои, снизу вверх: .env.example (значения по умолчанию, в репозитории)
   → .env / .env.local (не в репозитории, туда же пароль почты) → переменные
   окружения процесса. Свежий клон собирается без настройки, а правка
   реквизитов — это правка одной строки в .env.

   Ключи VITE_ORG_* публичные: они попадают в бандл и видны в браузере.
   Секреты (YANDEX_APP_PASSWORD) префикса не имеют и остаются на сервере. */
function parseEnvFile(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (line.trimStart().startsWith('#')) continue
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!m) continue
    out[m[1]] = m[2].trim().replace(/^(["'])(.*)\1$/, '$2')
  }
  return out
}

/* Наложение слоя: пустое значение сверху не затирает заданное снизу.
   Иначе забытая пустая строка в .env молча выключает настройку, а выглядит
   это на проде как «форма перестала работать». */
const mergeEnv = (base, layer) =>
  Object.entries(layer).reduce(
    (acc, [key, value]) => (value === '' && acc[key] ? acc : { ...acc, [key]: value }),
    { ...base },
  )

/* Только содержимое файлов, без process.env: этот набор уезжает на хостинг
   как dist/.env, и высыпать туда всё окружение сборочной машины нельзя. */
const ENV_FILES = ['.env.example', '.env', '.env.local']
const fileEnv = () =>
  ENV_FILES.reduce((acc, name) => mergeEnv(acc, parseEnvFile(resolve(here, name))), {})

const siteEnv = (mode) => mergeEnv(fileEnv(), loadEnv(mode, here, ''))

const orgOf = (env) =>
  Object.fromEntries(Object.entries(env).filter(([key]) => key.startsWith('VITE_ORG_')))

/* Кладёт рядом со сборкой .env, который читает PHP-обработчик на хостинге. */
function envForHosting() {
  return {
    name: 'env-for-hosting',
    writeBundle(options) {
      const values = fileEnv()
      const body = [
        '# Собран автоматически: npm run build (.env.example + .env + .env.local).',
        '# Правьте .env в корне проекта и пересоберите — этот файл перезапишется.',
        ...Object.entries(values).map(([key, value]) => `${key}=${value}`),
      ].join('\n')
      writeFileSync(resolve(options.dir, '.env'), `${body}\n`)

      if (!values.OPERATOR_EMAIL || !values.YANDEX_APP_PASSWORD) {
        this.warn(
          'dist/.env записан, но OPERATOR_EMAIL или YANDEX_APP_PASSWORD пуст — форма не будет отправлять письма',
        )
      }

      /* Незаполненные реквизиты видны в Политике и Согласии как %VITE_ORG_*%.
         Это сделано намеренно, но собрать такое и не заметить нельзя: правовой
         документ с дыркой на месте ИНН публиковать нельзя. */
      const REQUIRED_ORG = [
        'VITE_ORG_NAME_SHORT',
        'VITE_ORG_NAME_FULL',
        'VITE_ORG_INN',
        'VITE_ORG_OGRN',
        'VITE_ORG_ADDRESS',
        'VITE_ORG_EMAIL',
      ]
      const missing = REQUIRED_ORG.filter((key) => !String(values[key] ?? '').trim())
      if (missing.length) {
        this.warn(
          `Реквизиты не заполнены: ${missing.join(', ')}. ` +
            'В Политике и Согласии на их месте останутся плейсхолдеры — впишите значения в .env и пересоберите.',
        )
      }
    },
  }
}

const API_PROXY = { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true } }

export default defineConfig(({ mode }) => ({
  plugins: [vue(), envForHosting()],
  /* Реквизиты в бандл кладём одним объектом, а не через import.meta.env: Vite
     читает только .env*, а значения по умолчанию лежат в .env.example, и мы
     хотим, чтобы клиент видел ровно тот же набор, что и сборка. */
  define: { __ORG__: JSON.stringify(orgOf(siteEnv(mode))) },
  /* Форма постит на /api/send.php — в разработке и в локальном предпросмотре
     это Node API (server/index.js), на хостинге тот же путь обслуживает PHP из
     public/api/. Прокси нужен обоим режимам: без него `npm run preview`
     показывает страницу, на которой форма молча не работает. */
  server: { proxy: API_PROXY },
  preview: { proxy: API_PROXY },
}))
