<script setup>
const directions = [
  {
    code: '152-ФЗ',
    title: 'Персональные данные',
    lede: 'Проверяем юридическое оформление сбора и обработки персональных данных через сайт.',
    points: [
      'политику обработки персональных данных',
      'согласия на обработку персональных данных',
      'формы обратной связи',
      'формы заказа и регистрации',
      'поля ФИО, телефона, e-mail и других данных',
      'чекбоксы и тексты возле форм',
      'cookies',
      'системы аналитики',
      'используемые сторонние сервисы',
      'цели и основания обработки',
      'соответствие документов реальной работе сайта',
      'иные применимые требования в зависимости от проекта',
    ],
  },
  {
    code: '168-ФЗ',
    title: 'Публичная информация на сайте',
    lede: 'Проверяем применимые к бизнесу требования к информации, предназначенной для публичного ознакомления потребителей.',
    points: [
      'используемые на сайте обозначения',
      'названия разделов и элементов',
      'публичную информацию для потребителей',
      'использование иностранных слов и выражений',
      'наличие русскоязычных вариантов',
      'равнозначность представления информации',
      'применимость предусмотренных законом исключений',
      'другие элементы сайта под соответствующими требованиями',
    ],
  },
]
</script>

<template>
  <section class="section surface--laid laws-band" id="laws">
    <div class="laws-band__ground" aria-hidden="true"></div>

    <div class="container">
      <div class="head">
        <h2 v-reveal>Проверяем сайт сразу по двум направлениям</h2>
        <p class="head__lede">
          Их проверяют раздельно, а нарушают обычно вместе: один и тот же элемент
          сайта может не пройти по обоим сразу.
        </p>
      </div>

      <div class="laws">
        <article v-for="(d, i) in directions" :key="d.code" v-reveal="i" class="law">
          <header class="law__head">
            <span class="law__code">{{ d.code }}</span>
            <div>
              <h3>{{ d.title }}</h3>
              <p class="law__lede">{{ d.lede }}</p>
            </div>
          </header>

          <div>
            <p class="label law__caption">Что проверяем</p>
            <ul class="law__points">
              <li v-for="pt in d.points" :key="pt">
                <span class="mark mark--clear" aria-hidden="true">✓</span>
                <span>{{ pt }}</span>
              </li>
            </ul>
          </div>

          <a class="btn btn--seal law__cta" href="#intake">Проверить по {{ d.code }}</a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Та же чертёжная клетка, что в герое. Поверхность здесь светлая подложка,
   поэтому линии бумажные (--rule), а не осветлённые, как на графитовой полосе.
   Слой инертный и лежит под содержимым. */
.laws-band {
  position: relative;
  isolation: isolate;
  overflow: clip;
}

.laws-band__ground {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    168deg,
    color-mix(in oklch, var(--ground-2) 92%, var(--seal) 8%),
    var(--ground-2) 58%
  );
}

.laws-band__ground::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(to right, var(--rule) 0 1px, transparent 1px var(--grid-step)),
    repeating-linear-gradient(to bottom, var(--rule) 0 1px, transparent 1px var(--grid-step));
  opacity: 0.55;
  mask-image: radial-gradient(130% 95% at 18% 20%, #000 0%, transparent 74%);
}

.laws {
  display: grid;
  gap: var(--space-xl);
}

/* Unequal on purpose: 152-ФЗ carries more of the work */
@media (min-width: 58rem) {
  .laws {
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr);
  }
}

.law {
  display: grid;
  align-content: start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--ground);
  border: var(--rule-hair) solid var(--rule-strong);
  border-radius: var(--radius-lg);
}

.law__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-md);
  align-items: start;
}

.law__code {
  display: grid;
  place-items: center;
  padding: var(--space-2xs) var(--space-sm);
  background: var(--seal);
  color: var(--seal-ink);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  white-space: nowrap;
}

.law__lede {
  margin-top: var(--space-2xs);
  font-size: var(--text-base);
  color: var(--muted);
  max-width: 44ch;
}

.law__caption {
  padding-bottom: var(--space-xs);
  border-bottom: var(--rule-thick) solid var(--rule-strong);
}

.law__points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.law__points li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-sm);
  align-items: start;
  padding-block: var(--space-xs);
  border-bottom: var(--rule-hair) solid var(--rule);
  font-size: var(--text-base);
  color: var(--ink-2);
}

.law__cta {
  justify-self: start;
}

@media (max-width: 34rem) {
  .law {
    padding: var(--space-lg) var(--space-md);
  }
  .law__points th {
    width: 7rem;
  }
}
</style>
