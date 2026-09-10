<script setup>
import { computed, ref } from 'vue'
import SealMark from './SealMark.vue'
import { useLegalDoc } from '../composables/useLegalDoc'

const { open: openDoc } = useLegalDoc()

const site = ref('')
const contact = ref('')
const name = ref('')
const consent = ref(false)
const kind = ref('complex')

const kinds = [
  { id: 'pd', label: 'Проверка по 152-ФЗ' },
  { id: 'info', label: 'Проверка по 168-ФЗ' },
  { id: 'complex', label: 'Комплексная проверка' },
  { id: 'other', label: 'Другой запрос' },
]
const state = ref('idle')
const errorText = ref('')

const submitLabel = computed(() => {
  if (state.value === 'loading') return 'Отправляем…'
  if (state.value === 'success') return 'Заявка принята'
  if (state.value === 'error') return 'Повторить'
  return 'Отправить на проверку'
})

const buttonState = computed(() => (state.value === 'idle' ? undefined : state.value))

async function submit() {
  if (state.value === 'loading') return

  if (!site.value.trim()) {
    state.value = 'error'
    errorText.value = 'Адрес сайта не указан. Впишите домен — например, example.ru.'
    return
  }
  if (!contact.value.trim()) {
    state.value = 'error'
    errorText.value = 'Не указан способ связи. Оставьте телефон, Telegram или почту.'
    return
  }
  if (!consent.value) {
    state.value = 'error'
    errorText.value = 'Проверка начинается с согласия на обработку данных. Отметьте пункт ниже.'
    return
  }

  errorText.value = ''
  state.value = 'loading'

  try {
    const res = await fetch('/api/send.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site: site.value.trim(),
        contact: contact.value.trim(),
        name: name.value.trim(),
        kind: kind.value,
      }),
    })

    // Ответ может быть и не JSON (упавший PHP отдаёт HTML) — не даём разбору
    // выброситься и показать пользователю «Unexpected token <».
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      state.value = 'error'
      errorText.value =
        data.error || 'Не удалось отправить заявку. Напишите нам на почту или попробуйте позже.'
      return
    }

    state.value = 'success'
    site.value = ''
    contact.value = ''
    name.value = ''
    consent.value = false
    kind.value = 'complex'
  } catch {
    state.value = 'error'
    errorText.value = 'Нет связи с сервером. Проверьте соединение и попробуйте ещё раз.'
  }
}

const grounds = [
  { law: '152-ФЗ', what: 'Персональные данные', detail: 'формы, согласия, cookies, трекеры' },
  { law: '168-ФЗ', what: 'Публичная информация', detail: 'тексты, обозначения, формулировки' },
]
</script>

<template>
  <section class="hero surface--stock">
    <div class="hero__ground" aria-hidden="true">
      <svg class="hero__grain-src" width="0" height="0" focusable="false">
        <filter id="stock-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" />
        </filter>
      </svg>
    </div>

    <div class="container hero__inner">
      <p class="hero__filing">
        <span class="label">Юридическая проверка сайтов для бизнеса</span>
        <span class="hero__filing-rule" aria-hidden="true"></span>
        <span class="label label--seal">Дело №&nbsp;152/168</span>
      </p>

      <div class="hero__grid">
        <div class="hero__copy">
          <h1 class="hero__display">
            Ваш сайт соответствует требованиям 152-ФЗ и&nbsp;168-ФЗ?
          </h1>

          <p class="hero__lede">
            Проверим сайт, формы, документы, согласия и публичную информацию.
            Найдём нарушения и приведём сайт в соответствие с актуальными
            требованиями законодательства.
          </p>

          <p class="hero__sub">
            Даже если реклама настроена и оформлена правильно, нарушения на самом
            сайте и в документах могут создавать отдельные юридические риски.
          </p>

          <div class="hero__actions">
            <a class="btn btn--seal" href="#intake">Проверить мой сайт</a>
            <a class="link" href="#stages">Как устроена проверка →</a>
          </div>

          <ol class="route" aria-label="Порядок первичной работы">
            <li>Первичный анализ сайта</li>
            <li>Выявим основные риски</li>
            <li>Предложим варианты устранения</li>
          </ol>

          <table class="ledger hero__grounds">
            <caption class="label">Основания проверки</caption>
            <tbody>
              <tr v-for="g in grounds" :key="g.law">
                <th scope="row" class="hero__law">{{ g.law }}</th>
                <td class="hero__what">{{ g.what }}</td>
                <td class="hero__detail">{{ g.detail }}</td>
              </tr>
            </tbody>
          </table>

          <p class="hero__attest">
            <SealMark
              class="hero__seal"
              label="Печать: сверено с документами, 152-ФЗ и 168-ФЗ"
            />
            <span>
              Проверка идёт по обоим основаниям сразу. Раздельно они дают ложное
              спокойствие: документ может быть безупречен, а форма&nbsp;— нет.
            </span>
          </p>
        </div>

        <aside class="sheet" id="intake" aria-labelledby="intake-title">
          <div class="sheet__head">
            <span class="label">Бланк заявки</span>
            <span class="label label--verd sheet__state">
              <span class="mark mark--clear" aria-hidden="true">✓</span>
              Принимаем
            </span>
          </div>

          <form class="sheet__body" novalidate @submit.prevent="submit">
            <h2 id="intake-title" class="sheet__title">Отправьте адрес сайта</h2>
            <p class="sheet__note">
              Достаточно домена и одного контакта. Ответим и назовём срок по вашему
              сайту.
            </p>

            <label class="field">
              <span class="label">Адрес сайта</span>
              <input v-model="site" type="text" inputmode="url" autocomplete="url" placeholder="example.ru" />
            </label>

            <label class="field">
              <span class="label">Телефон, Telegram или почта</span>
              <input v-model="contact" type="text" autocomplete="tel" placeholder="+7 900 000-00-00" />
            </label>

            <label class="field">
              <span class="label">Как к вам обращаться</span>
              <input v-model="name" type="text" autocomplete="name" placeholder="Имя и фамилия" />
            </label>

            <fieldset class="kinds">
              <legend class="label">Что проверяем</legend>
              <div class="kinds__row">
                <label v-for="k in kinds" :key="k.id" class="kind">
                  <input v-model="kind" type="radio" name="check-kind" :value="k.id" />
                  <span>{{ k.label }}</span>
                </label>
              </div>
            </fieldset>

            <label class="consent">
              <input v-model="consent" type="checkbox" />
              <span>
                Согласен на обработку персональных данных на условиях
                <button type="button" class="consent__doc" @click.stop="openDoc('privacy', $event)">
                  политики обработки</button>
                и даю
                <button type="button" class="consent__doc" @click.stop="openDoc('consent', $event)">
                  согласие на обработку</button>.
              </span>
            </label>

            <button
              class="btn btn--seal sheet__submit"
              type="submit"
              :data-state="buttonState"
              :disabled="state === 'loading'"
            >
              {{ submitLabel }}
            </button>

            <p v-if="state === 'error'" class="sheet__msg sheet__msg--error" role="alert">
              <span class="mark mark--breach" aria-hidden="true">!</span>
              {{ errorText }}
            </p>
            <p v-else-if="state === 'success'" class="sheet__msg sheet__msg--ok" role="status">
              <span class="mark mark--clear" aria-hidden="true">✓</span>
              Заявка у нас. Ответим по указанному контакту.
            </p>
            <p v-else class="sheet__msg">
              Ничего не публикуем и не передаём третьим лицам.
            </p>
          </form>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  padding-block: calc(var(--nav-height) + var(--space-lg)) var(--space-3xl);
  border-bottom: var(--rule-thick) solid var(--rule-strong);
}

/* Document stock: a drafting grid and grain, never a mesh or a colour loop */
.hero__ground {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    168deg,
    color-mix(in oklch, var(--ground) 92%, var(--seal) 8%),
    var(--ground) 55%
  );
}

.hero__ground::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(to right, var(--rule) 0 1px, transparent 1px var(--grid-step)),
    repeating-linear-gradient(to bottom, var(--rule) 0 1px, transparent 1px var(--grid-step));
  opacity: 0.55;
  mask-image: radial-gradient(130% 95% at 20% 22%, #000 0%, transparent 74%);
}

.hero__ground::after {
  content: '';
  position: absolute;
  inset: 0;
  filter: url(#stock-grain);
  opacity: 0.045;
  mix-blend-mode: multiply;
}

.hero__grain-src {
  position: absolute;
}

/* Filing line — one named kicker, at the top of the page only */
.hero__filing {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding-bottom: var(--space-md);
}

.hero__filing-rule {
  flex: 1;
  height: var(--rule-hair);
  background: var(--rule-strong);
}

.hero__display {
  margin-bottom: var(--space-xl);
}

.hero__grid {
  display: grid;
  gap: var(--space-2xl);
  align-items: start;
}

@media (min-width: 62rem) {
  .hero__grid {
    /* Бланк фиксированной ширины, заголовку — весь остаток: доли здесь дают
       разную ширину колонки на каждом экране, а она должна быть не уже, чем
       самая длинная строка заголовка. */
    grid-template-columns: minmax(0, 1fr) minmax(0, 28rem);
    gap: var(--space-2xl);
  }
}

.hero__lede {
  max-width: 52ch;
  font-size: var(--text-md);
  color: var(--ink-2);
}

.hero__sub {
  max-width: 52ch;
  margin-top: var(--space-sm);
  color: var(--muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-lg);
  margin-top: var(--space-xl);
}

/* The three-beat route the spec puts under the CTA */
.route {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs) var(--space-md);
  margin: var(--space-lg) 0 0;
  padding: 0;
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.route li {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.route li:not(:last-child)::after {
  content: '→';
  color: var(--seal);
  font-weight: 600;
}

/* Check-type selector. Radios stay in normal flow with zero size — absolutely
   positioned ones make the page jump to the section top on every click. */
.kinds {
  margin: 0;
  padding: 0;
  border: 0;
}

.kinds__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  margin-top: var(--space-2xs);
}

.kind {
  cursor: pointer;
}

.kind input {
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
}

.kind span {
  display: inline-block;
  padding: var(--space-2xs) var(--space-sm);
  border: var(--rule-hair) solid var(--rule-strong);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--ink-2);
  transition:
    border-color var(--dur-micro) var(--ease-out),
    background-color var(--dur-micro) var(--ease-out),
    color var(--dur-micro) var(--ease-out);
}

.kind input:checked + span {
  background: var(--seal);
  border-color: var(--seal);
  color: var(--seal-ink);
  font-weight: 600;
}

.kind input:focus-visible + span {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .kind input:not(:checked) + span:hover {
    border-color: var(--seal);
    color: var(--seal);
  }
}

.consent__doc {
  /* Кнопка, а не ссылка: документ открывается в модалке, никуда не уводя из
     наполовину заполненной формы. */
  padding: 0;
  background: none;
  border: 0;
  border-bottom: var(--rule-hair) solid color-mix(in oklch, var(--seal) 40%, transparent);
  font: inherit;
  cursor: pointer;
  color: var(--seal);
  font-weight: 500;
}

.consent__doc:focus-visible {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: 2px;
  border-radius: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .consent__doc:hover {
    border-bottom-color: var(--seal);
  }
}

.hero__grounds {
  margin-top: var(--space-lg);
  border-top: var(--rule-thick) solid var(--rule-strong);
}

.hero__grounds caption {
  padding-top: var(--space-md);
}

.hero__law {
  width: 7.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--seal);
  white-space: nowrap;
}

.hero__what {
  font-weight: 600;
  color: var(--ink);
}

.hero__detail {
  color: var(--muted);
  font-size: var(--text-base);
}

/* ── The filing sheet ───────────────────────────────────── */

.sheet {
  position: relative;
  background: var(--ground);
  border: var(--rule-thick) solid var(--ink);
  border-radius: var(--radius-lg);
  box-shadow: 6px 6px 0 var(--ground-3);
}

.sheet__head {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-lg);
  border-bottom: var(--rule-hair) solid var(--rule-strong);
  background: var(--ground-2);
  border-radius: calc(var(--radius-lg) - 3px) calc(var(--radius-lg) - 3px) 0 0;
}

.sheet__state {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
}

.sheet__body {
  display: grid;
  gap: var(--space-md);
  padding: var(--space-xl) var(--space-lg) var(--space-lg);
}

.sheet__title {
  font-size: var(--text-lg);
}

.sheet__note {
  margin-top: calc(var(--space-xs) * -1);
  font-size: var(--text-base);
  color: var(--muted);
}

.field {
  display: grid;
  gap: var(--space-2xs);
}

/* Ruled fields, like a form printed to be filled in by hand */
.field input {
  width: 100%;
  min-height: 48px;
  padding: var(--space-xs) var(--space-sm);
  background: color-mix(in oklch, var(--ground-2) 55%, transparent);
  border: 0;
  border-bottom: var(--rule-thick) solid var(--rule-strong);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  outline: var(--rule-thick) solid transparent;
  outline-offset: 1px;
  font-size: var(--text-base);
  transition: border-color var(--dur-micro) var(--ease-out);
}

.field input::placeholder {
  color: var(--muted);
}

@media (hover: hover) and (pointer: fine) {
  .field input:hover {
    border-bottom-color: var(--ink-2);
  }
}

.field input:focus-visible,
.consent input:focus-visible {
  outline-color: var(--focus);
  border-bottom-color: var(--seal);
}

.consent {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-xs);
  align-items: start;
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.consent input {
  margin-top: var(--space-3xs);
  accent-color: var(--seal);
  width: 18px;
  height: 18px;
}

.sheet__submit {
  width: 100%;
}

.sheet__msg {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  min-height: 1lh;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--muted);
}

.sheet__msg--error {
  color: var(--seal);
}

.sheet__msg--ok {
  color: var(--verd);
}

/* The seal signs the grounds it attests to, and sits beside the text rather
   than on top of it — a stamp over the fine print is a bug, not a flourish. */
.hero__attest {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-lg);
  align-items: center;
  margin-top: var(--space-lg);
  max-width: 54ch;
  font-size: var(--text-base);
  color: var(--muted);
}

.hero__seal {
  width: 92px;
  flex: none;
}

@media (max-width: 40rem) {
  /* The rule between the two labels collapses to nothing once they wrap —
     drop it and let the pair sit as two lines. */
  .hero__filing {
    flex-wrap: wrap;
    gap: var(--space-2xs) var(--space-md);
  }
  .hero__filing-rule {
    display: none;
  }
}

@media (max-width: 34rem) {
  .hero__attest {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-md);
  }
  .hero__seal {
    width: 76px;
  }
}

@media (max-width: 34rem) {
  .hero__grounds :is(th, td) {
    padding-inline: 0 var(--space-sm);
  }
  .hero__detail {
    display: none;
  }
}
</style>
