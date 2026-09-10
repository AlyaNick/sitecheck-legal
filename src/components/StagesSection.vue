<script setup>
// A real sequence, so the numbering carries information rather than decorating.
const stages = [
  { id: '1', label: 'Заявка', title: 'Вы присылаете сайт', body: 'Получаем ссылку и короткую информацию о бизнесе.', out: 'Вводные зафиксированы' },
  { id: '2', label: 'Аудит', title: 'Проводим аудит', body: 'Проверяем сайт, документы, формы и применимые требования.', out: 'Черновик находок' },
  { id: '3', label: 'Разбор', title: 'Показываем проблемы', body: 'Не просто «нарушена статья такая-то», а: где проблема → почему это проблема → что необходимо изменить.', out: 'Перечень рисков' },
  { id: '4', label: 'Документы', title: 'Исправляем документы', body: 'Готовим необходимые документы и формулировки под конкретный сайт.', out: 'Комплект документов' },
  { id: '5', label: 'ТЗ', title: 'Даём ТЗ разработчику', body: 'Что убрать, что добавить, где поставить ссылку, где изменить текст, как оформить форму.', out: 'ТЗ на правки' },
  { id: '6', label: 'Сверка', title: 'Проверяем результат', body: 'После внесения изменений повторно проверяем сайт.', out: 'Повторная проверка' },
]
</script>

<template>
  <section class="section surface--stock" id="stages">
    <div class="container">
      <div class="head">
        <h2 v-reveal>От ссылки на сайт до готового решения</h2>
        <p class="section__lede">
          Шесть шагов, каждый со своим результатом на руках. Порядок здесь не
          оформление, а последовательность: пропустить шаг нельзя.
        </p>
      </div>

      <ol class="stages">
        <li v-for="(s, i) in stages" :key="s.id" v-reveal="i" class="stage">
          <span class="stage__num" aria-hidden="true">{{ s.id }}</span>

          <div class="stage__main">
            <p class="label stage__label">{{ s.label }}</p>
            <h3>{{ s.title }}</h3>
            <p class="stage__text">{{ s.body }}</p>
          </div>

          <p class="stage__out">
            <span class="label">На выходе</span>
            <span class="stage__artifact">{{ s.out }}</span>
          </p>
        </li>
      </ol>

      <a v-reveal class="btn btn--seal stages__cta" href="#intake">Начать с первого шага</a>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 62ch;
  margin-bottom: var(--space-2xl);
}

.stages {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: stage;
}

.stage {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 15rem);
  gap: var(--space-lg) var(--space-xl);
  align-items: start;
  padding-block: var(--space-xl);
  border-top: var(--rule-hair) solid var(--rule);
}

.stage:first-child {
  border-top: var(--rule-heavy) solid var(--ink);
}

.stage:last-child {
  border-bottom: var(--rule-heavy) solid var(--ink);
}

/* The step number set as a struck figure, not a floating label */
.stage__num {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: var(--rule-thick) solid var(--seal);
  border-radius: 50%;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-md);
  color: var(--seal);
}

.stage__main {
  max-width: 60ch;
}

.stage__label {
  margin-bottom: var(--space-3xs);
}

.stage__text {
  margin-top: var(--space-xs);
  color: var(--ink-2);
}

.stage__out {
  display: grid;
  gap: var(--space-3xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--ground-2);
  border-radius: var(--radius-md);
}

.stage__artifact {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--ink);
}

.stages__cta {
  margin-top: var(--space-xl);
}

@media (max-width: 62rem) {
  .stage {
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--space-md);
    padding-block: var(--space-lg);
  }
  .stage__out {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
