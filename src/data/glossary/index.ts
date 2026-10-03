import { CORE_TERMS } from './core'
import type { GlossaryEntry } from './types'

export type { GlossaryEntry } from './types'

/** Short definitions shown in popovers when a highlighted term is clicked. One file per topic. */
export const GLOSSARY = {
  ...CORE_TERMS,
} satisfies Record<string, GlossaryEntry>

export type GlossaryId = keyof typeof GLOSSARY
