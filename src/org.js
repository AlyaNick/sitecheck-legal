/* Реквизиты организации — из переменных окружения, не из вёрстки.

   Значения приходят из .env.example (значения по умолчанию, в репозитории) и
   перекрываются локальным .env — см. vite.config.js. Vite подставляет их на
   сборке, так что в бандле оказываются готовые строки.

   Те же ключи в виде плейсхолдеров %VITE_ORG_*% используются в src/legal/*.html
   (подстановка в браузере, потому что документы грузятся как ?raw). */
/* global __ORG__ */
const env = __ORG__

export const org = {
  brand: env.VITE_ORG_BRAND,
  nameShort: env.VITE_ORG_NAME_SHORT,
  nameFull: env.VITE_ORG_NAME_FULL,
  inn: env.VITE_ORG_INN,
  kpp: env.VITE_ORG_KPP,
  ogrn: env.VITE_ORG_OGRN,
  okved: env.VITE_ORG_OKVED,
  address: env.VITE_ORG_ADDRESS,
  email: env.VITE_ORG_EMAIL,
  phone: env.VITE_ORG_PHONE,
  director: env.VITE_ORG_DIRECTOR,
  telegram: env.VITE_ORG_TELEGRAM,
}

/* Карта «плейсхолдер → значение» строится из самих переменных, поэтому новый
   ключ VITE_ORG_* начинает работать в документах без правок этого файла.

   Пустые значения в карту НЕ попадают: незаполненный реквизит должен остаться
   в тексте видимым плейсхолдером %VITE_ORG_INN%, а не превратиться в пустоту.
   Иначе правовой документ тихо публикуется с фразой «ОГРН , ИНН .» — и этого
   никто не замечает, пока не спросит проверяющий. */
export const orgTokens = Object.fromEntries(
  Object.entries(env)
    .filter(([, value]) => String(value ?? '').trim() !== '')
    .map(([key, value]) => [`%${key}%`, String(value)]),
)
