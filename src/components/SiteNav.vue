<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const scrolled = ref(false)
let frame = 0

function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 24
    frame = 0
  })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled }">
    <div class="nav__inner container">
      <a class="brand" href="#main">
        <span class="brand__stamp" aria-hidden="true">ПС</span>
        <span class="brand__name">Право<span class="brand__suffix">Сайт</span></span>
      </a>

      <nav class="nav__links" aria-label="Разделы страницы">
        <a class="nav__link" href="#mismatch">Проблема</a>
        <a class="nav__link" href="#laws">Направления</a>
        <a class="nav__link" href="#scope">Что проверяем</a>
        <a class="nav__link" href="#risks">Риски</a>
        <a class="nav__link" href="#stages">Порядок</a>
        <a class="nav__link" href="#faq">Вопросы</a>
      </nav>

      <a class="btn btn--seal nav__cta" href="#intake">Проверить сайт</a>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: var(--z-sticky);
  background: transparent;
  border-bottom: var(--rule-hair) solid transparent;
  transition:
    background-color var(--dur-short) var(--ease-out),
    border-color var(--dur-short) var(--ease-out);
}

.nav.is-scrolled {
  background: color-mix(in oklch, var(--ground) 88%, transparent);
  backdrop-filter: blur(12px) saturate(140%);
  border-bottom-color: var(--rule-strong);
}

.nav__inner {
  height: var(--nav-height);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

/* Wordmark as a struck stamp block, not a logotype */
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  white-space: nowrap;
  margin-right: auto;
}

.brand__stamp {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: var(--rule-thick) solid var(--seal);
  border-radius: var(--radius-sm);
  color: var(--seal);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-2xs);
  letter-spacing: 0.02em;
}

.brand__name {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.brand__suffix {
  font-weight: 600;
  color: var(--muted);
}

.nav__links {
  display: flex;
  gap: var(--space-lg);
}

.nav__link {
  white-space: nowrap;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--ink-2);
  padding-block: var(--space-2xs);
  border-bottom: var(--rule-thick) solid transparent;
  transition:
    color var(--dur-micro) var(--ease-out),
    border-color var(--dur-micro) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .nav__link:hover {
    color: var(--seal);
    border-bottom-color: var(--seal);
  }
}

.nav__link:focus-visible,
.brand:focus-visible {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: 4px;
  border-radius: 2px;
}

@media (max-width: 66rem) {
  .nav__links {
    display: none;
  }
}

@media (max-width: 30rem) {
  .nav__cta {
    padding-inline: var(--space-md);
  }
}
</style>
