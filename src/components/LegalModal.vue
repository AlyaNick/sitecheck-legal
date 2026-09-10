<script setup>
import { ref, watch, nextTick, onUnmounted, computed } from 'vue'
import { useLegalDoc, LEGAL_DOCS } from '../composables/useLegalDoc'
import { fillSite } from '../site'
import '../assets/legal-doc.css'

const { activeDoc, open, close } = useLegalDoc()

// Тексты документов лежат в src/legal/*.html и грузятся по требованию, поэтому
// ~27 КБ юридической прозы не попадают в начальный бандл лендинга.
const loaders = {
  privacy: () => import('../legal/privacy.html?raw'),
  consent: () => import('../legal/consent.html?raw'),
}
const cache = {}

const html = ref('')
const loading = ref(false)
const loadError = ref(false)
const panel = ref(null)
const body = ref(null)
const closeBtn = ref(null)
let cited = null

const doc = computed(() => (activeDoc.value ? LEGAL_DOCS[activeDoc.value] : null))

watch(activeDoc, async (name, prev) => {
  document.body.style.overflow = name ? 'hidden' : ''
  window[name ? 'addEventListener' : 'removeEventListener']('keydown', onKeydown)

  if (!name) {
    html.value = ''
    cited = null
    return
  }

  if (prev !== name) {
    // При переключении документа старая разметка выбрасывается, иначе ссылка
    // на подсвеченный пункт указывала бы на отсоединённый узел.
    cited = null
    loadError.value = false
    if (cache[name]) {
      html.value = cache[name]
    } else {
      loading.value = true
      html.value = ''
      try {
        // Документы ссылаются на адрес самого сайта — подставляем его из хоста,
        // на котором нас открыли, и только потом кэшируем разметку.
        cache[name] = fillSite((await loaders[name]()).default)
        // Защита от быстрого переключения: рисуем, только если документ ещё открыт.
        if (activeDoc.value === name) html.value = cache[name]
      } catch {
        loadError.value = true
      } finally {
        loading.value = false
      }
    }
  }

  await nextTick()
  closeBtn.value?.focus()
  if (body.value) body.value.scrollTop = 0
})

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
    return
  }
  if (e.key !== 'Tab' || !panel.value) return

  // Ловушка фокуса внутри диалога.
  const items = [
    ...panel.value.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => el.offsetParent !== null)
  if (!items.length) return

  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/* Прокручиваем панель, а не страницу, и помечаем пункт: документ живёт внутри
   диалога, поэтому собственный переход браузера по :target здесь не работает. */
function goToAnchor(id) {
  const el = body.value?.querySelector(`[id="${CSS.escape(id)}"]`)
  if (!el) return
  cited?.classList.remove('is-cited')
  el.classList.add('is-cited')
  cited = el
  const top = el.getBoundingClientRect().top - body.value.getBoundingClientRect().top
  // Плавную прокрутку из JS правило prefers-reduced-motion в CSS не покрывает,
  // поэтому уважаем его здесь вручную.
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  body.value.scrollBy({ top: top - 24, behavior: reduce ? 'auto' : 'smooth' })
}

// Один делегированный обработчик на все ссылки внутри документа.
function onContentClick(e) {
  const link = e.target.closest('a')
  if (!link || !body.value?.contains(link)) return

  // Перекрёстные ссылки между документами меняют содержимое модалки, а не уводят.
  const other = link.dataset.doc
  if (other && LEGAL_DOCS[other]) {
    e.preventDefault()
    open(other)
    return
  }

  const href = link.getAttribute('href') || ''
  if (href.startsWith('#')) {
    e.preventDefault()
    goToAnchor(href.slice(1))
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="doc" class="overlay" @click.self="close">
        <div ref="panel" class="panel" role="dialog" aria-modal="true" :aria-label="doc.title">
          <div class="panel__bar">
            <span class="panel__title">{{ doc.short }}</span>

            <nav class="panel__switch" aria-label="Правовые документы">
              <button
                v-for="(meta, key) in LEGAL_DOCS"
                :key="key"
                type="button"
                class="panel__tab"
                :class="{ 'is-active': key === activeDoc }"
                :aria-current="key === activeDoc ? 'true' : undefined"
                @click="open(key)"
              >
                {{ meta.short }}
              </button>
            </nav>

            <button
              ref="closeBtn"
              type="button"
              class="panel__close"
              aria-label="Закрыть документ"
              @click="close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref="body" class="panel__body" tabindex="-1" @click="onContentClick">
            <p v-if="loading" class="panel__state">Загружаем документ…</p>
            <p v-else-if="loadError" class="panel__state">
              Не удалось загрузить документ. Проверьте соединение и откройте его ещё раз.
            </p>
            <!-- eslint-disable-next-line vue/no-v-html -- сборочный ассет, не пользовательский ввод -->
            <div v-else class="doc" v-html="html"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  /* Телепортировано в <body>, то есть вне корня приложения — типографику
     приходится задавать заново, иначе документ упадёт на системную серифную. */
  font-family: var(--font-body);
  color: var(--ink-2);
  -webkit-font-smoothing: antialiased;
  display: grid;
  place-items: center;
  padding: clamp(0.5rem, 3vw, 2.5rem);
  background: color-mix(in oklch, var(--folio) 72%, transparent);
  backdrop-filter: blur(6px);
}

.panel {
  display: flex;
  flex-direction: column;
  width: min(58rem, 100%);
  max-height: min(88vh, 100%);
  background: var(--ground);
  border: var(--rule-thick) solid var(--ink);
  border-radius: var(--radius-lg);
  box-shadow: 0 40px 100px color-mix(in oklch, var(--folio) 45%, transparent);
  overflow: hidden;
}

.panel__bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-sm) var(--space-sm) var(--space-lg);
  background: var(--ground-2);
  border-bottom: var(--rule-hair) solid var(--rule-strong);
}

.panel__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: -0.015em;
  color: var(--ink);
  /* Одна строка на любой ширине — полное название стоит заголовком документа */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Переключение между двумя документами, не выходя из модалки */
.panel__switch {
  display: flex;
  gap: var(--space-2xs);
  margin-left: auto;
}

.panel__tab {
  white-space: nowrap;
  padding: var(--space-2xs) var(--space-sm);
  background: transparent;
  border: var(--rule-hair) solid var(--rule-strong);
  border-radius: var(--radius-sm);
  font-size: var(--text-2xs);
  font-weight: 600;
  color: var(--ink-2);
  cursor: pointer;
  transition:
    background-color var(--dur-micro) var(--ease-out),
    border-color var(--dur-micro) var(--ease-out),
    color var(--dur-micro) var(--ease-out);
}

.panel__tab.is-active {
  background: var(--seal);
  border-color: var(--seal);
  color: var(--seal-ink);
}

@media (hover: hover) and (pointer: fine) {
  .panel__tab:not(.is-active):hover {
    border-color: var(--seal);
    color: var(--seal);
  }
}

.panel__close {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border: var(--rule-hair) solid var(--rule-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink-2);
  cursor: pointer;
  transition:
    border-color var(--dur-micro) var(--ease-out),
    color var(--dur-micro) var(--ease-out);
}

.panel__close svg {
  width: 18px;
  height: 18px;
}

@media (hover: hover) and (pointer: fine) {
  .panel__close:hover {
    border-color: var(--seal);
    color: var(--seal);
  }
}

.panel__tab:focus-visible,
.panel__close:focus-visible {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: 2px;
}

.panel__body {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--space-xl) var(--space-lg);
}

.panel__body:focus-visible {
  outline: none;
}

.panel__state {
  padding: var(--space-xl) 0;
  text-align: center;
  color: var(--muted);
}

@media (prefers-reduced-motion: no-preference) {
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity var(--dur-short) var(--ease-out);
  }
  .modal-enter-active .panel,
  .modal-leave-active .panel {
    transition: transform var(--dur-short) var(--ease-out);
  }
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  .modal-enter-from .panel,
  .modal-leave-to .panel {
    transform: translateY(8px);
  }
}

@media (max-width: 44rem) {
  .panel__bar {
    flex-wrap: wrap;
    padding-left: var(--space-md);
  }
  .panel__title {
    display: none;
  }
  .panel__switch {
    margin-left: 0;
    flex: 1;
  }
  .panel__body {
    padding: var(--space-lg) var(--space-md);
  }
}
</style>
