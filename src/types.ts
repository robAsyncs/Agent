import type { ComponentType } from 'react'

export type LaneId = 'user' | 'agent' | 'llm' | 'tools' | 'memory'

export type Category = 'core' | 'planning' | 'memory'

export type ActionKind =
  // core loop
  | 'system_prompt'
  | 'user_prompt'
  | 'llm_request'
  | 'reasoning'
  | 'final_response'
  // planning & tools
  | 'planning'
  | 'tool_selection'
  | 'tool_call'
  | 'tool_result'
  | 'observe'
  // memory & retrieval
  | 'memory_read'
  | 'memory_write'
  | 'retrieval'
  | 'context_management'

/** A message that ends up in the model's context window. */
export interface ContextEntry {
  role: 'system' | 'user' | 'assistant' | 'tool_result'
  summary: string
  tokens: number
}

export interface Step {
  kind: ActionKind
  from: LaneId
  to: LaneId
  label: string
  /** Scenario-specific explanation of what is happening at this step. */
  note: string
  /** Raw data exchanged. Strings render as-is, objects as JSON. */
  payload?: unknown
  /** Added to the context window when this step runs. */
  context?: ContextEntry
}

export interface Scenario {
  id: string
  title: string
  tagline: string
  steps: Step[]
}

export interface Concept {
  kind: ActionKind
  title: string
  category: Category
  summary: string
  description: string
  whyItMatters: string
  example: {
    steps: Step[]
  }
}

// ─── Topics ──────────────────────────────────────────────────

export type GroupId = 'foundations' | 'agents' | 'advanced' | 'production' | 'final'

export interface Section {
  title: string
  points: string[]
  /** Write-up for this section. */
  body?: string
}

export interface Source {
  title: string
  url: string
}

export interface Topic {
  /** URL slug: /topics/<id> */
  id: string
  /** null for the final project. */
  number: number | null
  title: string
  group: GroupId
  summary: string
  /** Bullet-point outline. Ignored when `article` is set. */
  sections: Section[]
  /** A full long-form write-up, rendered instead of the outline. */
  article?: ComponentType
  sources: Source[]
  /** What I built for this topic. Omitted for conceptual topics. */
  project?: string
  /** Interactive scenarios (by id) and actions that illustrate this topic. */
  scenarios?: string[]
  concepts?: ActionKind[]
}
