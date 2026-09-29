import type { Category, LaneId } from '../types'

export const LANES: { id: LaneId; label: string; hint: string }[] = [
  { id: 'user', label: 'User', hint: 'The person talking to the agent' },
  { id: 'agent', label: 'Agent', hint: 'The harness: your code that runs the loop' },
  { id: 'llm', label: 'LLM', hint: 'The model: it only reads and writes text' },
  { id: 'tools', label: 'Tools', hint: 'Functions the agent can execute' },
  { id: 'memory', label: 'Memory', hint: 'Long-term storage and vector search' },
]

export const CATEGORIES: Record<Category | 'advanced', { label: string; blurb: string }> = {
  core: {
    label: 'Core loop',
    blurb: 'The minimum an agent needs: instructions, a request, and a model that answers.',
  },
  planning: {
    label: 'Planning & tools',
    blurb: 'How the model breaks down work and acts on the world through tools.',
  },
  memory: {
    label: 'Memory & retrieval',
    blurb: 'How an agent knows things that are not in the current conversation.',
  },
  advanced: {
    label: 'Advanced',
    blurb: 'Subagents, reflection, guardrails, human-in-the-loop. Coming soon (see TODO.md).',
  },
}

/** Rough token estimate (~4 chars per token) used for the context window meter. */
export function approxTokens(value: unknown): number {
  const text = typeof value === 'string' ? value : JSON.stringify(value)
  return Math.max(1, Math.round(text.length / 4))
}
