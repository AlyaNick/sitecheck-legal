<script setup>
import { useLegalDoc } from '../composables/useLegalDoc'
import { org } from '../org'

const { open } = useLegalDoc()
</script>

<template>
  <footer class="foot">
    <div class="container foot__inner">
      <div class="foot__brand">
        <span class="foot__stamp" aria-hidden="true">ПС</span>
        <span>
          <span class="foot__name">ПравоСайт</span>
          <span class="foot__tag">Юридический аудит сайтов</span>
        </span>
      </div>

      <nav class="foot__links" aria-label="Служебные ссылки">
        <a href="#mismatch">Проблема</a>
        <a href="#offer">Что проверяем</a>
        <a href="#laws">Направления</a>
        <a href="#risks">Риски</a>
        <a href="#stages">Порядок</a>
        <a href="#faq">Вопросы</a>
        <a href="#intake">Заявка</a>
      </nav>

      <nav class="foot__legal" aria-label="Правовые документы">
        <button type="button" @click="open('privacy', $event)">Политика обработки ПДн</button>
        <button type="button" @click="open('consent', $event)">Согласие на обработку ПДн</button>
      </nav>

      <p class="foot__credit">
        <span v-if="org.nameShort">{{ org.nameShort }} · </span>
        <span v-if="org.inn" class="foot__inn">ИНН {{ org.inn }} · </span>© 2026
      </p>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  border-top: var(--rule-hair) solid var(--rule-strong);
  padding-block: var(--space-lg);
  background: var(--ground);
}

.foot__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md) var(--space-xl);
}

.foot__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.foot__stamp {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border: var(--rule-thick) solid var(--seal);
  border-radius: var(--radius-sm);
  color: var(--seal);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-2xs);
}

.foot__name {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--ink);
}

.foot__tag {
  display: block;
  font-size: var(--text-2xs);
  color: var(--muted);
}

.foot__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) var(--space-lg);
  padding-left: var(--space-lg);
  border-left: var(--rule-hair) solid var(--rule);
}

.foot__links a {
  white-space: nowrap;
  font-size: var(--text-sm);
  color: var(--ink-2);
  border-bottom: var(--rule-hair) solid transparent;
  transition: border-color var(--dur-micro) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .foot__links a:hover {
    border-bottom-color: var(--seal);
  }
}

.foot__links a:focus-visible {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: 3px;
  border-radius: 2px;
}

.foot__legal {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) var(--space-lg);
}

.foot__legal button {
  padding: 0;
  background: none;
  border: 0;
  border-bottom: var(--rule-hair) solid transparent;
  font: inherit;
  font-size: var(--text-sm);
  color: var(--ink-2);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color var(--dur-micro) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .foot__legal button:hover {
    border-bottom-color: var(--seal);
  }
}

.foot__legal button:focus-visible {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: 3px;
  border-radius: 2px;
}

.foot__credit {
  margin-left: auto;
  font-size: var(--text-sm);
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.foot__inn {
  white-space: nowrap;
}

@media (max-width: 52rem) {
  .foot__links {
    padding-left: 0;
    border-left: 0;
    width: 100%;
  }
  .foot__credit {
    margin-left: 0;
  }
}
</style>
