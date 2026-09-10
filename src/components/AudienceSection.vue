<script setup>
const audience = [
  { who: 'Интернет-магазин', why: 'Получаете ФИО, телефон, адрес доставки, e-mail и данные заказов.' },
  { who: 'Компания услуг', why: 'Получаете заявки и обращения клиентов через сайт.' },
  { who: 'Онлайн-сервис', why: 'Используете регистрацию, личные кабинеты или подписки.' },
  { who: 'Клиника или медицинский бизнес', why: 'Получаете заявки и потенциально работаете с чувствительной информацией.' },
  { who: 'Образовательный проект', why: 'Используете регистрацию, формы и данные учеников или клиентов.' },
  { who: 'Агентство или B2B', why: 'Получаете контакты потенциальных клиентов через формы и системы аналитики.' },
  { who: 'Практически любой коммерческий сайт', why: 'Если посетитель может оставить телефон, e-mail, имя или другие данные — вопросы обработки уже требуют внимания.', wide: true },
]
</script>

<template>
  <section class="section surface--laid">
    <div class="container">
      <div class="head">
        <h2 v-reveal>Проверьте сайт, если вы</h2>
        <p class="head__lede">
          Чем чувствительнее данные и чем больше форм, тем выше цена расхождения.
        </p>
      </div>

      <ul class="audience">
        <li
          v-for="(a, i) in audience"
          :key="a.who"
          v-reveal="i"
          class="who"
          :class="{ 'who--wide': a.wide }"
        >
          <h3 class="who__name">{{ a.who }}</h3>
          <p class="who__why">{{ a.why }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Колонок ровно три, а не auto-fit: шесть категорий делятся на 3, 2 и 1 без
   остатка, поэтому последний ряд всегда заполнен. При auto-fit пятая карточка
   оставляла четыре пустых места, и фон сетки проступал серым блоком. */
.audience {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--rule-hair);
  background: var(--rule);
  border: var(--rule-hair) solid var(--rule);
  border-radius: var(--radius-md);
  overflow: hidden;
}

@media (min-width: 40rem) {
  .audience {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 62rem) {
  .audience {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Hairline gaps carry the grid; a bordered card per cell would be one layer too many */
.who {
  display: grid;
  align-content: start;
  padding: var(--space-lg);
  background: var(--ground);
}

.who__name {
  font-size: var(--text-base);
}

.who__why {
  margin-top: var(--space-2xs);
  font-size: var(--text-base);
  color: var(--muted);
}

/* The catch-all case closes the grid across its full width */
.who--wide {
  grid-column: 1 / -1;
  background: var(--seal-wash);
}

.who--wide .who__why {
  color: var(--ink-2);
  max-width: 72ch;
}
</style>
