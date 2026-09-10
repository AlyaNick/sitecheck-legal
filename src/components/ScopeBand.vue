<script setup>
const scope = [
  { key: 'Контент сайта', note: 'Тексты, публичная информация, обозначения и другие юридически значимые элементы.', law: '168-ФЗ' },
  { key: 'Формы', note: 'Обратная связь, заказ, регистрация, подписка, консультация и другие формы.', law: '152-ФЗ' },
  { key: 'Персональные данные', note: 'Какие данные получает сайт и на каком основании они обрабатываются.', law: '152-ФЗ' },
  { key: 'Согласия', note: 'Как пользователь предоставляет согласия и соответствует ли механизм требованиям.', law: '152-ФЗ' },
  { key: 'Документы', note: 'Политики, согласия и другие необходимые документы.', law: 'оба' },
  { key: 'Cookies и аналитика', note: 'Какие технологии и сторонние сервисы используются и как это отражено юридически.', law: '152-ФЗ' },
  { key: 'Публичная информация', note: 'Проверка применимых требований к информации, размещённой для потребителей.', law: '168-ФЗ' },
  { key: 'Взаимосвязь элементов', note: 'Самое важное: соответствуют ли документы тому, что сайт делает на самом деле.', law: 'оба', pivotal: true },
]
</script>

<template>
  <section class="section surface--folio band" id="scope">
    <div class="band__ground" aria-hidden="true"></div>

    <div class="container">
      <div class="head">
        <h2 v-reveal>Что входит в юридический аудит сайта</h2>
        <p class="head__lede">
          Восемь слоёв, каждый со своим основанием. Нарушение прячется в одном
          скрытом поле, одном checkbox или одном подключённом сервисе — поэтому
          проходим все, а не те, где обычно смотрят.
        </p>
      </div>

      <table class="ledger scope">
        <thead>
          <tr>
            <th scope="col" class="label scope__num-col">№</th>
            <th scope="col" class="label">Слой</th>
            <th scope="col" class="label">Что смотрим</th>
            <th scope="col" class="label scope__law-col">Основание</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in scope"
            :key="item.key"
            v-reveal="i"
            :class="{ 'is-pivotal': item.pivotal }"
          >
            <td class="scope__num numero">{{ String(i + 1).padStart(2, '0') }}</td>
            <th scope="row" class="scope__key">{{ item.key }}</th>
            <td class="scope__note">{{ item.note }}</td>
            <td class="scope__law">
              <span class="label">{{ item.law }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
/* Та же чертёжная клетка, что и в герое, но линиями под тёмный фон: на
   графите светлые волосяные линии, а не бумажные. Слой инертный и лежит под
   содержимым. Блок «Цена ошибки» — отдельный компонент, его это не касается. */
.band {
  position: relative;
  isolation: isolate;
  overflow: clip;
}

.band__ground {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    168deg,
    color-mix(in oklch, var(--folio) 88%, var(--seal) 12%),
    var(--folio) 58%
  );
}

.band__ground::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(to right, var(--folio-rule) 0 1px, transparent 1px var(--grid-step)),
    repeating-linear-gradient(to bottom, var(--folio-rule) 0 1px, transparent 1px var(--grid-step));
  opacity: 0.5;
  mask-image: radial-gradient(130% 95% at 18% 20%, #000 0%, transparent 74%);
}

.scope__num-col {
  width: 3.5rem;
}

.scope__law-col {
  width: 8rem;
}

.scope__num {
  color: var(--seal-bright);
}

.scope__key {
  width: 12rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--on-folio);
  white-space: nowrap;
}

.scope__note {
  color: var(--on-folio-2);
}

.scope__law .label {
  color: var(--on-folio-2);
}

/* The eighth layer is the thesis of the whole page — it gets its own weight */
.is-pivotal {
  background: var(--folio-2);
}

.is-pivotal .scope__key {
  color: var(--seal-bright);
}

.is-pivotal .scope__note {
  color: var(--on-folio);
}

@media (max-width: 60rem) {
  .scope thead {
    display: none;
  }
  .scope tr {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr) auto;
    gap: var(--space-2xs) var(--space-sm);
    padding-block: var(--space-md);
    border-bottom: var(--rule-hair) solid var(--folio-rule);
  }
  .scope :is(th, td) {
    border: 0;
    padding: 0;
    width: auto;
  }
  .scope__note {
    grid-column: 2 / -1;
  }
  .is-pivotal {
    padding-inline: var(--space-sm);
    border-radius: var(--radius-sm);
  }
}
</style>
