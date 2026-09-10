/* Адрес, по которому страница реально открыта.

   Правовые документы называют сайт внутри собственного текста («посетитель
   сайта …», «по сетевому адресу …»), и рисует их сама страница — поэтому адрес
   читается со страницы, а не хранится копией домена в тексте. */
import { orgTokens } from './org'

export const siteUrl = `${window.location.origin}/`
export const siteHost = window.location.host

/* Адрес сайта плюс все реквизиты из .env. Неизвестный %ТОКЕН% оставляем как
   есть — заметный плейсхолдер в тексте лучше, чем молча съеденный кусок
   документа: пустой реквизит должен бросаться в глаза, а не исчезать. */
const tokens = { '%SITE_URL%': siteUrl, '%SITE_HOST%': siteHost, ...orgTokens }

export function fillSite(text) {
  return text.replace(/%[A-Z_]+%/g, (token) => (token in tokens ? tokens[token] : token))
}
