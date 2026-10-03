export interface GlossaryEntry {
  term: string
  definition: string
  /** Topic id with more detail, shown as a link in the popover. */
  topic?: string
}
