<script setup>
// A notarial stamp, drawn rather than illustrated: two rings, text set around
// the circumference, a ruled centre. Appears once or twice on the page as a
// signature under a claim — never as decoration on every section.
defineProps({
  around: { type: String, default: 'СВЕРЕНО С ДОКУМЕНТАМИ · SITECHECK LEGAL ·' },
  top: { type: String, default: '152-ФЗ' },
  bottom: { type: String, default: '168-ФЗ' },
  label: { type: String, required: true },
})

const id = `seal-${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <svg class="seal" viewBox="0 0 120 120" role="img" :aria-label="label">
    <defs>
      <path
        :id="id"
        fill="none"
        d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
      />
    </defs>

    <circle class="seal__ring" cx="60" cy="60" r="57" />
    <circle class="seal__ring seal__ring--inner" cx="60" cy="60" r="38" />

    <text class="seal__around">
      <textPath :href="`#${id}`" startOffset="0%">{{ around }}</textPath>
    </text>

    <text class="seal__top" x="60" y="53" text-anchor="middle">{{ top }}</text>
    <line class="seal__bar" x1="34" y1="60" x2="86" y2="60" />
    <text class="seal__bottom" x="60" y="75" text-anchor="middle">{{ bottom }}</text>
  </svg>
</template>

<style scoped>
.seal {
  width: 100%;
  height: auto;
  color: var(--seal);
  /* Struck by hand: never perfectly square to the grid */
  transform: rotate(-7deg);
}

.seal__ring {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
}

.seal__ring--inner {
  stroke-width: 1;
  opacity: 0.75;
}

.seal__around {
  fill: currentColor;
  font-family: var(--font-body);
  font-size: 8.4px;
  font-weight: 600;
  letter-spacing: 1.15px;
}

.seal__top,
.seal__bottom {
  fill: currentColor;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.4px;
}

.seal__bar {
  stroke: currentColor;
  stroke-width: 1;
}
</style>
