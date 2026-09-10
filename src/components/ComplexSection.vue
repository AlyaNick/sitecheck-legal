<script setup>
// Block 5 — the objection-handler: "I already ordered a policy, I'm covered."
// Each case ends the same way on purpose; the repetition is the argument.
const cases = [
  { has: 'Политика есть', but: 'Но форма заявки оформлена неправильно.' },
  { has: 'Согласие есть', but: 'Но его содержание не соответствует фактической обработке данных.' },
  { has: 'Документы обновили', but: 'Но забыли про cookies, аналитику или сторонние сервисы.' },
  { has: 'Проверили рекламу', but: 'Но не проверили юридическое оформление самого сайта.' },
]
</script>

<template>
  <section class="section surface--laid" id="complex">
    <div class="container">
      <div class="head">
        <h2 v-reveal>Исправить только один документ — не значит исправить сайт</h2>
        <p class="head__lede">
          Каждый из этих случаев выглядит как закрытый вопрос. Ни один из них
          не закрывает риск.
        </p>
      </div>

      <ul class="cases">
        <li v-for="(c, i) in cases" :key="c.has" v-reveal="i" class="case">
          <p class="case__has">
            <span class="mark mark--clear" aria-hidden="true">✓</span>
            {{ c.has }}
          </p>
          <p class="case__but">{{ c.but }}</p>
          <p class="case__risk">
            <span aria-hidden="true">→</span>
            Риск остаётся
          </p>
        </li>
      </ul>

      <p class="closing">
        Поэтому наша задача&nbsp;— не «выдать документы». Наша задача&nbsp;— привести
        документы и фактическую работу сайта в соответствие друг с другом.
      </p>
    </div>
  </section>
</template>

<style scoped>
.cases {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-md);
}

@media (min-width: 52rem) {
  .cases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.case {
  display: grid;
  gap: var(--space-xs);
  align-content: start;
  padding: var(--space-lg);
  background: var(--ground);
  border: var(--rule-hair) solid var(--rule-strong);
  border-radius: var(--radius-md);
}

.case__has {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--ink);
}

.case__but {
  color: var(--ink-2);
}

/* The verdict every case lands on — the repetition is the point */
.case__risk {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
  margin-top: var(--space-2xs);
  padding-top: var(--space-sm);
  border-top: var(--rule-hair) solid var(--rule);
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--seal);
}

.closing {
  margin-top: var(--space-2xl);
  padding-top: var(--space-lg);
  border-top: var(--rule-heavy) solid var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  line-height: 1.38;
  color: var(--ink);
}
</style>
