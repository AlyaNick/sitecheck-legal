<script setup>
const delivery = [
  { item: 'Аудит сайта', form: 'отчёт' },
  { item: 'Карта выявленных рисков', form: 'перечень' },
  { item: 'Рекомендации по устранению', form: 'по приоритету' },
  { item: 'Необходимые документы', form: 'готовые тексты' },
  { item: 'Тексты согласий', form: 'формулировки' },
  { item: 'Корректировки форм', form: 'правки' },
  { item: 'Рекомендации по cookies и аналитике', form: 'разбор' },
  { item: 'Рекомендации по публичной информации', form: 'разбор' },
  { item: 'Техническое задание', form: 'для разработчика' },
  { item: 'Повторная проверка', form: 'после внедрения' },
]
</script>

<template>
  <section class="section surface--laid">
    <div class="container delivery">
      <div class="delivery__copy">
        <h2 v-reveal>На выходе — не папка с шаблонами, а юридически проработанный сайт</h2>
        <p class="section__lede">
          В зависимости от выбранного тарифа клиент получает перечень ниже.
        </p>
        <p class="delivery__note">
          Все документы готовятся с учётом конкретного сайта и фактических
          процессов бизнеса.
        </p>
      </div>

      <table class="ledger delivery__list">
        <tbody>
          <tr v-for="(d, i) in delivery" :key="d.item" v-reveal="i">
            <td class="delivery__mark">
              <span class="mark mark--clear" aria-hidden="true">✓</span>
            </td>
            <th scope="row" class="delivery__item">{{ d.item }}</th>
            <td class="delivery__form">
              <span class="label">{{ d.form }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.delivery {
  display: grid;
  /* minmax(0, 1fr), а не неявная колонка: иначе таблица с nowrap-колонкой
     задаёт треку свою min-content ширину (390px) и вытаскивает за вьюпорт
     заголовок с лидом, которые лежат в том же треке. */
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-2xl);
  align-items: start;
}

@media (min-width: 62rem) {
  .delivery {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
    gap: var(--space-3xl);
  }
}

/* На узком экране строка перестаёт быть табличной: min-content трёх колонок
   в сумме шире вьюпорта, и никакой nowrap этого не лечит — таблица считает
   ширину по содержимому, а не по контейнеру. */
@media (max-width: 34rem) {
  .delivery__list,
  .delivery__list tbody,
  .delivery__list tr,
  .delivery__list :is(th, td) {
    display: block;
    width: auto;
  }
  .delivery__list tr {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--space-2xs) var(--space-sm);
    padding-block: var(--space-sm);
    border-bottom: var(--rule-hair) solid var(--rule);
  }
  .delivery__list :is(th, td) {
    padding: 0;
    border: 0;
  }
  .delivery__form {
    grid-column: 2;
    text-align: left;
    white-space: normal;
  }
}

.delivery__copy {
  max-width: 44ch;
}

.delivery__note {
  margin-top: var(--space-lg);
  padding-left: var(--space-lg);
  border-left: var(--rule-thick) solid var(--seal);
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--ink);
}

.delivery__list {
  border-top: var(--rule-thick) solid var(--rule-strong);
}

.delivery__mark {
  width: 2.5rem;
  padding-right: 0;
}

.delivery__item {
  font-weight: 600;
  color: var(--ink);
}

.delivery__form {
  text-align: right;
  white-space: nowrap;
}
</style>
