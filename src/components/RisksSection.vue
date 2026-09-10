<script setup>
// Block 7. No figures here: the spec deliberately avoids naming sums until the
// table of offences has had its own legal review. A fabricated number on a page
// selling legal diligence would cost more than the section earns.
const spots = [
  'одна форма',
  'один некорректный документ',
  'одно неправильно оформленное согласие',
  'неучтённый способ обработки данных',
]
</script>

<template>
  <section class="section surface--folio risks" id="risks">
    <div class="container risks__inner">
      <div class="risks__copy">
        <h2 v-reveal>Цена ошибки может быть значительно выше стоимости аудита</h2>

        <p class="risks__lede">
          Нарушения законодательства о персональных данных предусматривают
          самостоятельные составы административных правонарушений.
        </p>

        <p class="risks__note">
          Ответственность зависит от конкретного нарушения, статуса нарушителя,
          повторности и обстоятельств дела.
        </p>

        <a class="btn btn--seal risks__cta" href="#intake">Узнать, есть ли нарушения</a>
      </div>

      <div class="risks__spots">
        <p class="label">При этом проблема может находиться буквально в нескольких элементах сайта</p>
        <ul class="spots">
          <li v-for="(s, i) in spots" :key="s" v-reveal="i" class="spot">
            <span class="mark mark--breach" aria-hidden="true">!</span>
            {{ s }}
          </li>
        </ul>
        <p class="risks__closing">
          Поэтому дешевле обнаружить проблему до проверки или претензии.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.risks__inner {
  display: grid;
  gap: var(--space-2xl);
  align-items: start;
}

@media (min-width: 62rem) {
  .risks__inner {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: var(--space-3xl);
  }
}

.risks__lede {
  max-width: 52ch;
  margin-top: var(--space-md);
  font-size: var(--text-md);
  color: var(--on-folio-2);
}

.risks__note {
  max-width: 52ch;
  margin-top: var(--space-sm);
  font-size: var(--text-base);
  color: var(--on-folio-2);
}

.risks__cta {
  margin-top: var(--space-xl);
}

.spots {
  list-style: none;
  margin: var(--space-md) 0 0;
  padding: 0;
  border-top: var(--rule-hair) solid var(--folio-rule);
}

.spot {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding-block: var(--space-md);
  border-bottom: var(--rule-hair) solid var(--folio-rule);
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--on-folio);
}

.risks__closing {
  margin-top: var(--space-lg);
  max-width: 48ch;
  font-size: var(--text-base);
  color: var(--seal-bright);
  font-weight: 500;
}
</style>
