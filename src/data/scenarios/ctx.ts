import type { ContextEntry } from '../../types'
import { approxTokens } from '../meta'

export function ctx(role: ContextEntry['role'], summary: string, content: unknown): ContextEntry {
  return { role, summary, tokens: approxTokens(content) }
}
