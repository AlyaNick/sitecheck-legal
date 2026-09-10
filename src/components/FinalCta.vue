<script setup>
import SealMark from './SealMark.vue'
</script>

<template>
  <section class="final surface--folio">
    <div class="container final__inner">
      <div class="final__copy">
        <h2 v-reveal class="final__title">
          Не уверены, соответствует ли ваш сайт требованиям законодательства?
        </h2>
        <p class="final__lede">
          Пришлите ссылку и опишите задачу. Мы изучим исходные данные, определим
          необходимый объём работы и рассчитаем стоимость.
        </p>
      </div>

      <div class="final__action">
        <a class="btn btn--seal" href="#intake">Связаться с нами</a>
        <p class="final__meta">
          152-ФЗ&nbsp;• 168-ФЗ&nbsp;• Комплексная проверка&nbsp;• Другие юридические задачи
        </p>
      </div>

      <SealMark
        class="final__seal"
        around="ДО ПРЕТЕНЗИИ · НЕ ПОСЛЕ · SITECHECK LEGAL ·"
        top="24–48"
        bottom="часов"
        label="Печать: первичный анализ за 24–48 часов"
      />
    </div>
  </section>
</template>

<style scoped>
.final {
  padding-block: var(--space-3xl);
  border-top: var(--rule-heavy) solid var(--seal);
}

.final__inner {
  display: grid;
  gap: var(--space-xl);
  align-items: center;
}

@media (min-width: 62rem) {
  .final__inner {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.6fr) auto;
    gap: var(--space-2xl);
  }
}

.final__title {
  max-width: 22ch;
}

.final__lede {
  max-width: 52ch;
  margin-top: var(--space-md);
  color: var(--on-folio-2);
}

.final__action {
  display: grid;
  gap: var(--space-md);
  justify-items: start;
}

.final__meta {
  font-size: var(--text-sm);
  color: var(--on-folio-2);
  line-height: 1.7;
}

.final__seal {
  width: 116px;
  color: var(--seal-bright);
  justify-self: end;
}

@media (max-width: 62rem) {
  .final__seal {
    width: 92px;
    justify-self: start;
  }
}
</style>
