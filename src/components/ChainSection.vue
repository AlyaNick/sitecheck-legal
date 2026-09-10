<script setup>
// Block 3 — the route the data travels, run across the full measure as eight
// stations on a line. The page's other sections all sit in a left column; this
// one uses the whole width on purpose, so the chain reads as a distance
// covered rather than a list.
const chain = [
  { name: 'Пользователь', what: 'кто пришёл и что готов оставить' },
  { name: 'Сайт', what: 'что показано и что предложено' },
  { name: 'Форма', what: 'какие поля собирает на деле' },
  { name: 'Согласие', what: 'на что и каким образом его получают' },
  { name: 'Персональные данные', what: 'что именно попадает к вам' },
  { name: 'Документы', what: 'что о собранном написано' },
  { name: 'Сторонние сервисы', what: 'кому данные уходят дальше' },
  { name: 'Хранение и обработка', what: 'где оседают и на каком основании' },
]

const results = [
  'где именно находятся нарушения;',
  'насколько они критичны;',
  'что необходимо исправить;',
  'какие документы заменить или подготовить;',
  'что необходимо изменить непосредственно на сайте.',
]
</script>

<template>
  <section class="section surface--stock" id="offer">
    <div class="container">
      <div class="head">
        <h2 v-reveal>Проверяем не один документ. Проверяем весь сайт.</h2>
        <p class="head__lede">
          Документы нельзя оценивать отдельно от того, как фактически работает
          сайт. Поэтому мы проходим весь маршрут — от посетителя до места, где
          данные оседают.
        </p>
      </div>

      <ol
        class="route"
        aria-label="Маршрут данных: пользователь, сайт, форма, согласие, персональные данные, документы, сторонние сервисы, хранение и обработка"
      >
        <li
          v-for="(link, i) in chain"
          :key="link.name"
          v-reveal="i"
          class="stop"
          :class="{ 'stop--end': i === chain.length - 1 }"
          :style="{ '--i': i }"
        >
          <span class="stop__rail" aria-hidden="true"></span>
          <span class="stop__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="stop__name">{{ link.name }}</h3>
          <p class="stop__what">{{ link.what }}</p>
        </li>
      </ol>

      <div class="tail">
        <p class="tail__also">
          А также публично размещённую на сайте информацию, к которой применяются
          соответствующие требования законодательства.
        </p>

        <div class="result">
          <h3 class="result__title">Результат: вы понимаете</h3>
          <ul class="result__list">
            <li v-for="r in results" :key="r">{{ r }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Маршрут ─────────────────────────────────────────────
   Четыре станции в ряд, два ряда. Линия проходит сквозь номера, поэтому
   направление читается раньше, чем текст. */
.route {
  --dot: 3rem;
  /* Полный круг обхода: по 1.75 с на станцию */
  --hop: 14s;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--space-lg);
  row-gap: var(--space-2xl);
}

.stop {
  position: relative;
  padding-top: calc(var(--dot) + var(--space-md));
}

/* Отрезок рельса вправо от номера к соседней станции */
.stop__rail {
  position: absolute;
  top: calc(var(--dot) / 2);
  left: var(--dot);
  right: calc(var(--space-lg) * -1);
  height: var(--rule-thick);
  background: var(--rule-strong);
}

/* У последней станции ряда рельс никуда не ведёт */
.stop:nth-child(4n) .stop__rail,
.route .stop--end .stop__rail {
  display: none;
}

/* Наконечник у входа в следующую станцию */
.stop__rail::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: var(--rule-strong);
}

.stop__num {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: var(--dot);
  height: var(--dot);
  border: var(--rule-thick) solid var(--ink);
  border-radius: 50%;
  background: var(--ground);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}

/* Конец маршрута назван цветом в подписи, а не заливкой номера: заливка
   спорила бы с бегущей точкой, которая тоже красная. */
.stop--end .stop__name {
  color: var(--seal);
}

/* ── Бегущая точка ───────────────────────────────────────
   Станции загораются по очереди и по кругу. Сдвиг ровно на одну секунду при
   восьмисекундном цикле, а окно свечения чуть шире секунды — поэтому соседние
   станции на мгновение перекрываются, и переход читается как перебегание,
   а не как поочерёдное мигание. */
@media (prefers-reduced-motion: no-preference) {
  .stop__num {
    /* ease-in-out применяется к каждому отрезку между кадрами, поэтому
       разгорание и угасание идут мягко, а не равномерной заливкой. */
    animation: hop var(--hop) var(--ease-in-out) infinite;
    animation-delay: calc(var(--i, 0) * var(--hop) / 8);
  }
}

/* Окно свечения 19% цикла при шаге в 12.5% — соседние станции перекрываются
   почти на секунду, и точка переходит перетеканием, а не переключением. */
/* Зажигается обводкой и цифрой, а не заливкой с вывороткой.
   Кроссфейд «тёмное по светлому» → «светлое по тёмному» неизбежно проходит
   через кадр, где текст и фон сходятся: замер ловил 2.1:1 в середине перехода.
   Здесь обе крайности — тёмное по светлому, поэтому контраст высок всю дорогу
   (ink/ground 16:1 в покое, seal/seal-wash 7:1 в свечении). */
@keyframes hop {
  0%,
  1% {
    background: var(--ground);
    border-color: var(--ink);
    color: var(--ink);
  }
  7%,
  14% {
    background: var(--seal-wash);
    border-color: var(--seal);
    color: var(--seal);
  }
  20%,
  100% {
    background: var(--ground);
    border-color: var(--ink);
    color: var(--ink);
  }
}

/* Без анимации конец маршрута отмечаем заливкой — иначе он ничем не выделен */
@media (prefers-reduced-motion: reduce) {
  .stop--end .stop__num {
    background: var(--seal);
    border-color: var(--seal);
    color: var(--seal-ink);
  }
}

.stop__name {
  font-size: var(--text-md);
  line-height: 1.22;
}

.stop__what {
  margin-top: var(--space-2xs);
  font-size: var(--text-base);
  color: var(--muted);
}

/* ── Хвост: сноска и результат в две колонки, чтобы правая половина
      не пустовала так же, как в остальных секциях ── */
.tail {
  display: grid;
  gap: var(--space-xl);
  margin-top: var(--space-3xl);
  padding-top: var(--space-lg);
  border-top: var(--rule-heavy) solid var(--ink);
}

@media (min-width: 62rem) {
  .tail {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
    gap: var(--space-3xl);
  }
}

.tail__also {
  font-size: var(--text-base);
  color: var(--muted);
  max-width: 46ch;
}

.result__title {
  font-size: var(--text-md);
}

.result__list {
  margin: var(--space-md) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-xs);
}

.result__list li {
  position: relative;
  padding-left: var(--space-lg);
  color: var(--ink-2);
}

.result__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 10px;
  height: var(--rule-hair);
  background: var(--seal);
}

@media (max-width: 72rem) {
  .route {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .stop:nth-child(4n) .stop__rail {
    display: block;
  }
  .stop:nth-child(2n) .stop__rail,
  .route .stop--end .stop__rail {
    display: none;
  }
}

/* Одна колонка: рельс разворачивается в вертикаль слева от станций */
@media (max-width: 40rem) {
  .route {
    --dot: 2.5rem;
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
  .stop {
    padding: 0 0 var(--space-lg) calc(var(--dot) + var(--space-md));
  }
  /* В вертикали рельс нужен у всех станций, кроме последней: перечисляем оба
     :nth-child из раскладок выше — они весомее одиночного .stop__rail. */
  .stop__rail,
  .stop:nth-child(2n) .stop__rail,
  .stop:nth-child(4n) .stop__rail {
    display: block;
    top: var(--dot);
    left: calc(var(--dot) / 2 - 1px);
    right: auto;
    bottom: 0;
    width: var(--rule-thick);
    height: auto;
  }
  /* Специфичность выше, чем у :nth-child(4n) выше по файлу: восьмая станция
     попадает под 4n, и без этого рельс тянулся бы ниже конца маршрута. */
  .route .stop--end .stop__rail {
    display: none;
  }
  .stop__rail::after {
    display: none;
  }
}
</style>
