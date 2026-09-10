// Reveal enhances an already-visible default. The hidden state is applied only
// by this script, never by the stylesheet: a headless renderer, a background
// tab, or a JS error must leave the content on screen, not blank it.
//
// v-reveal      — fades and lifts once, on first entry
// v-reveal="3"  — same, offset by its index so a group enters as a sequence

const REDUCED = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Failsafe: anything still armed after this is shown regardless of the observer.
const FAILSAFE_MS = 2600

let observer = null
const armed = new Set()

function show(el) {
  el.classList.add('is-in')
  armed.delete(el)
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        show(entry.target)
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )
  return observer
}

let failsafe = 0
function scheduleFailsafe() {
  if (failsafe) return
  failsafe = window.setTimeout(() => {
    for (const el of [...armed]) {
      // Only rescue what the viewport has already reached; the rest stay armed
      // for the observer so scrolling still gets its entrance.
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) show(el)
    }
    failsafe = 0
    if (armed.size) scheduleFailsafe()
  }, FAILSAFE_MS)
}

export const reveal = {
  mounted(el, binding) {
    if (REDUCED() || typeof IntersectionObserver === 'undefined') return

    el.classList.add('reveal', 'is-armed')
    armed.add(el)

    if (typeof binding?.value === 'number') {
      el.style.setProperty('--i', String(Math.min(binding.value, 9)))
    }

    getObserver().observe(el)
    scheduleFailsafe()
  },
  unmounted(el) {
    armed.delete(el)
    observer?.unobserve(el)
  },
}
