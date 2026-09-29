import type { ActionKind, Scenario } from '../../types'
import { coding } from './coding'
import { research } from './research'
import { trip } from './trip'
import { weather } from './weather'

export const SCENARIOS: Scenario[] = [weather, trip, research, coding]

/** Every place a given action kind appears across all scenarios. */
export function occurrencesOf(kind: ActionKind) {
  return SCENARIOS.flatMap((scenario) =>
    scenario.steps.flatMap((step, index) => (step.kind === kind ? [{ scenario, index }] : [])),
  )
}
