import { ref } from 'vue'

// The two legal documents, keyed by the slug used everywhere else (partial
// filename, `data-doc` cross-links inside the documents, modal state).
export const LEGAL_DOCS = {
  privacy: {
    title: 'Политика обработки персональных данных',
    short: 'Политика обработки ПДн'
  },
  consent: {
    title: 'Согласие на обработку персональных данных',
    short: 'Согласие на обработку ПДн'
  }
}

// Module-level state: the footer and the contact form both open the same
// single modal instance mounted once in App.vue, so there is nothing to drill
// through the tree.
const activeDoc = ref(null)
let lastTrigger = null

export function useLegalDoc() {
  function open(name, event) {
    if (!LEGAL_DOCS[name]) return
    // Remember the link that opened us so focus can go back to it on close.
    if (event) lastTrigger = event.currentTarget
    activeDoc.value = name
  }

  function close() {
    activeDoc.value = null
    // preventScroll: the page is already where the reader left it, and the
    // trigger is inline text — scrolling it into view would shift the layout.
    lastTrigger?.focus?.({ preventScroll: true })
    lastTrigger = null
  }

  return { activeDoc, open, close }
}
