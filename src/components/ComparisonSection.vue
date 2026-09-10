<script setup>
const rows = [
  { axis: 'Формы', template: 'Не знает, какие формы стоят на вашем сайте', audit: 'Проверяем реальные формы' },
  { axis: 'Сервисы', template: 'Не знает, какие сервисы вы используете', audit: 'Изучаем используемые решения' },
  { axis: 'Данные', template: 'Не знает, какие данные вы собираете', audit: 'Определяем фактический сбор данных' },
  { axis: 'Цели', template: 'Не знает целей вашей обработки', audit: 'Анализируем конкретный сайт' },
  { axis: 'Работа сайта', template: 'Не проверяет фактическую работу сайта', audit: 'Адаптируем документы под неё' },
  { axis: 'Правки', template: 'Не проверяет другие юридические элементы', audit: 'Показываем, что изменить разработчику' },
]
</script>

<template>
  <section class="section surface--stock">
    <div class="container">
      <div class="head">
        <h2 v-reveal>Скачать шаблон или провести аудит?</h2>
        <p class="head__lede">
          Разница не в объёме текста, а в том, откуда он взялся: из чужой практики
          или из вашей.
        </p>
      </div>

      <div class="compare__scroll">
        <table class="ledger compare">
          <thead>
            <tr>
              <th scope="col" class="label">Ось сравнения</th>
              <th scope="col" class="label">Шаблон из интернета</th>
              <th scope="col" class="label label--seal">Индивидуальный аудит</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.axis">
              <th scope="row" class="compare__axis">{{ row.axis }}</th>
              <td class="compare__weak">
                <span class="cell">
                  <span class="mark mark--breach" aria-hidden="true">−</span>
                  <span>{{ row.template }}</span>
                </span>
              </td>
              <td class="compare__strong">
                <span class="cell">
                  <span class="mark mark--clear" aria-hidden="true">✓</span>
                  <span>{{ row.audit }}</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="close">
        Документы должны описывать ваш реальный бизнес, а не абстрактную компанию
        из шаблона.
      </p>
    </div>
  </section>
</template>

<style scoped>
.compare__scroll {
  overflow-x: auto;
}

.compare {
  min-width: 44rem;
}

.compare__axis {
  width: 10rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}

/* Гибкий контейнер живёт ВНУТРИ ячейки. display:flex на самом <td> выбивает
   его из табличной раскладки: ячейки перестают быть колонками и встают друг
   под другом, теряя связь со своими заголовками. */
.cell {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
}

.compare__weak {
  color: var(--muted);
}

.compare__strong {
  color: var(--ink);
  background: var(--verd-wash);
  font-weight: 500;
}

.close {
  margin-top: var(--space-2xl);
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  line-height: 1.38;
  color: var(--ink);
}
</style>
