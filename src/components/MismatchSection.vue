<script setup>
// The page's turn: what the owner believes, struck; what the audit finds,
// written in. Marked up as <del>/<ins> so the correction is real semantics,
// not a visual effect — assistive tech announces it as a correction.
const entries = [
  { claim: 'Политика опубликована', fix: 'Скачана из интернета.', where: 'подвал сайта' },
  { claim: 'Документы подготовлены', fix: 'Составлены несколько лет назад и не обновлялись.', where: 'дата редакции' },
  { claim: 'Формы работают', fix: 'Собирают данные без корректного оформления.', where: 'формы сайта' },
  { claim: 'Согласие получено', fix: 'Объединено с другими условиями в один чекбокс.', where: 'чекбокс у формы' },
  { claim: 'Аналитика подключена', fix: 'Cookies и сервисы аналитики не учтены при юридическом оформлении.', where: 'счётчики и трекеры' },
  { claim: 'Данные описаны', fix: 'Фактически собираемые данные отличаются от указанных в документах.', where: 'поля формы против политики' },
  { claim: 'Цели обработки указаны', fix: 'Сформулированы некорректно.', where: 'текст политики' },
  { claim: 'Информация размещена', fix: 'Не соответствует актуальным требованиям законодательства.', where: 'публичные разделы' },
]
</script>

<template>
  <section class="section surface--stock" id="mismatch">
    <div class="container">
      <div class="head">
        <h2 v-reveal>Документы есть. Сайт работает вразрез с ними.</h2>
        <p class="head__lede">
          На многих сайтах политика конфиденциальности, согласия и другие документы
          существуют только формально. При этом реальная работа сайта им
          не соответствует. Слева&nbsp;— то, что владелец считает правдой; справа&nbsp;—
          то, что оказывается на этом месте при проверке.
        </p>
      </div>

      <ul class="corrections">
        <li v-for="(e, i) in entries" :key="e.claim" v-reveal="i" class="entry">
          <p class="entry__claim">
            <del>{{ e.claim }}</del>
          </p>

          <p class="entry__fix">
            <span class="entry__caret" aria-hidden="true"></span>
            <ins>{{ e.fix }}</ins>
            <span class="label entry__where">{{ e.where }}</span>
          </p>
        </li>
      </ul>

      <div class="closing">
        <p class="closing__text">
          Внешне сайт выглядит нормально. Юридически&nbsp;— может содержать целый
          набор нарушений.
        </p>
        <a class="btn btn--seal" href="#intake">Проверить свой сайт</a>
      </div>
    </div>
  </section>
</template>

<style scoped>


.corrections {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: var(--rule-heavy) solid var(--ink);
}

.entry {
  display: grid;
  gap: var(--space-sm) var(--space-2xl);
  align-items: baseline;
  padding-block: var(--space-lg);
  border-bottom: var(--rule-hair) solid var(--rule);
}

/* The claim keeps the left measure; the correction takes the right half that
   was sitting empty. */
@media (min-width: 58rem) {
  .entry {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  }
}

.entry__claim {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.02em;
  color: var(--muted);
}

/* Struck through the line, not under it — and via text-decoration so the rule
   follows the text when it wraps, which a positioned bar cannot. */
.entry__claim del {
  text-decoration-line: line-through;
  text-decoration-color: var(--seal);
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
}

.entry__fix {
  position: relative;
  padding-left: var(--space-lg);
  color: var(--ink);
}

/* The corrector's mark in the margin */
.entry__caret {
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 10px;
  height: 10px;
  border-left: var(--rule-thick) solid var(--seal);
  border-bottom: var(--rule-thick) solid var(--seal);
  transform: rotate(-45deg);
}

.entry__fix ins {
  text-decoration: none;
  color: var(--seal);
  font-weight: 500;
}

.entry__where {
  display: block;
  margin-top: var(--space-2xs);
}

.closing {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-lg) var(--space-2xl);
  margin-top: var(--space-2xl);
  padding-top: var(--space-lg);
  border-top: var(--rule-thick) solid var(--seal);
}

.closing__text {
  max-width: 48ch;
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  line-height: 1.38;
  color: var(--ink);
}

@media (max-width: 58rem) {
  .entry__claim {
    font-size: var(--text-lg);
  }
}
</style>
