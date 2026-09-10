<script setup>
import { ref } from 'vue'

const faq = [
  {
    q: 'У меня уже есть политика конфиденциальности. Зачем аудит?',
    a: 'Наличие документа само по себе не означает, что сайт оформлен корректно. Необходимо проверить содержание документа, формы, согласия, фактический сбор данных и используемые сервисы.',
  },
  {
    q: 'Можно просто скачать документы из интернета?',
    a: 'Шаблон не учитывает конкретную работу вашего сайта: какие данные собираются, для каких целей, через какие формы и какие сторонние сервисы используются.',
  },
  {
    q: 'Вы проверяете только 152-ФЗ?',
    a: 'Нет. Мы анализируем сайт комплексно в рамках согласованного объёма проверки, включая применимые требования к персональным данным и публичной информации.',
  },
  {
    q: '168-ФЗ касается каждого сайта?',
    a: 'Применимость конкретных требований зависит от характера размещённой информации, деятельности компании и других обстоятельств. Именно поэтому сначала проводится анализ сайта, а не механическая замена всех иностранных слов.',
  },
  {
    q: 'Нужно будет переделывать сайт?',
    a: 'Не обязательно. Если технические изменения необходимы, мы укажем конкретные элементы и подготовим понятное ТЗ разработчику.',
  },
  {
    q: 'Вы сами вносите изменения на сайт?',
    a: 'Юридические документы и формулировки готовим мы. Технические изменения может внести ваш разработчик либо специалист, привлечённый отдельно.',
  },
  {
    q: 'Сколько занимает работа?',
    a: 'Срок зависит от размера сайта, количества форм, документов, сервисов и объёма обработки персональных данных. Срок фиксируется после первичного анализа.',
  },
]

// -1 — ни один вопрос не раскрыт: страница открывается ровным списком,
// а не с одним развёрнутым ответом, сдвигающим остальные.
const open = ref(-1)

/* Два независимых столбца, а не один grid на две колонки: в общей сетке
   раскрытый ответ растягивает всю строку и оставляет дыру в соседней колонке.
   Индексы сквозные, чтобы open/aria-controls остались едиными. */
const split = Math.ceil(faq.length / 2)
const columns = [
  faq.slice(0, split).map((item, i) => ({ item, i })),
  faq.slice(split).map((item, i) => ({ item, i: i + split })),
]

function toggle(index) {
  open.value = open.value === index ? -1 : index
}
</script>

<template>
  <section class="section surface--stock faq" id="faq">
    <div class="container">
      <h2 v-reveal>Частые вопросы</h2>

      <div class="faq__cols">
      <div v-for="(col, c) in columns" :key="c" class="faq__list">
        <div v-for="{ item, i } in col" :key="item.q" v-reveal class="faq__item">
          <h3 class="faq__heading">
            <button
              class="faq__trigger"
              type="button"
              :aria-expanded="open === i"
              :aria-controls="`faq-panel-${i}`"
              :id="`faq-trigger-${i}`"
              @click="toggle(i)"
            >
              <span>{{ item.q }}</span>
              <span class="faq__sign" aria-hidden="true">{{ open === i ? '−' : '+' }}</span>
            </button>
          </h3>

          <div
            class="faq__panel"
            :class="{ 'is-open': open === i }"
            :id="`faq-panel-${i}`"
            role="region"
            :aria-labelledby="`faq-trigger-${i}`"
          >
            <div class="faq__panel-inner">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding-block: var(--space-2xl) var(--space-3xl);
}

/* Блок занимает всю ширину секции, но строка ответа — нет: в один столбец на
   1328px она вышла бы под 110 знаков, вдвое больше читаемой меры. Поэтому
   ширину набирают две колонки, а не растянутая строка. */
.faq__cols {
  display: grid;
  gap: var(--space-xl) var(--space-3xl);
  margin-top: var(--space-xl);
  align-items: start;
  /* Пока колонка одна, ширину набирать нечем: без потолка на 1024px строка
     ответа доходила до 89 знаков. */
  max-width: 48rem;
}

/* 72rem, а не 60: на 1024px две колонки давали по 41 знаку — уже ниже
   читаемого минимума в 45. Ниже порога FAQ идёт одной колонкой. */
@media (min-width: 72rem) {
  .faq__cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: none;
  }
}

.faq__list {
  border-top: var(--rule-hair) solid var(--rule);
}

.faq__item {
  border-bottom: var(--rule-hair) solid var(--rule);
}

.faq__heading {
  margin: 0;
  font-size: inherit;
}

.faq__trigger {
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md);
  padding-block: var(--space-lg);
  background: none;
  border: 0;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--ink);
  transition: color var(--dur-micro) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .faq__trigger:hover {
    color: var(--seal);
  }
}

.faq__trigger:active {
  color: var(--seal);
}

.faq__trigger:focus-visible {
  outline: var(--rule-thick) solid var(--focus);
  outline-offset: -2px;
  border-radius: var(--radius-sm);
}

.faq__sign {
  flex: none;
  font-family: var(--font-display);
  font-size: var(--text-md);
  color: var(--seal);
}

.faq__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-long) var(--ease-in-out);
}

.faq__panel.is-open {
  grid-template-rows: 1fr;
}

.faq__panel-inner {
  overflow: hidden;
}

.faq__panel-inner p {
  padding-bottom: var(--space-lg);
  font-size: var(--text-base);
  color: var(--ink-2);
}

@media (prefers-reduced-motion: reduce) {
  .faq__panel {
    transition: none;
  }
}
</style>
