import type { GlossaryEntry } from './types'

/** Terms introduced in Topic 5. */
export const AGENT_LOOP_TERMS = {
  'agent-loop': {
    term: 'Agent loop',
    definition:
      'Call the model, run any tools it asks for, add the results to the history, and call it again, until it answers or a limit is hit.',
  },
  autonomy: {
    term: 'Autonomy level',
    definition:
      'How much the model decides on its own: from one fixed call, through code-defined workflows, to agents that pick every step.',
  },
  'stopping-condition': {
    term: 'Stopping condition',
    definition:
      'A rule that ends the loop: the model gives a final answer, an iteration or cost limit is reached, or errors keep repeating.',
  },
  'human-in-the-loop': {
    term: 'Human in the loop',
    definition:
      'The harness pauses before a risky action, such as deleting a file or sending money, and waits for a person to approve it.',
    topic: 'safety',
  },
  trajectory: {
    term: 'Trajectory',
    definition:
      'The full record of one agent run: every model call, tool call and result, in order. Also called a trace or transcript.',
    topic: 'evaluation',
  },
  'plan-and-execute': {
    term: 'Plan-and-execute',
    definition:
      'The model first writes a step-by-step plan, then carries out the steps one by one, revising the plan only when something fails.',
  },
  reflection: {
    term: 'Reflection',
    definition:
      'The model critiques its own output or failed attempt in words, then uses that critique to produce a better next attempt.',
  },
  'false-success': {
    term: 'False success',
    definition:
      'The agent reports a task as done when it isn’t, for example claiming tests pass without running them.',
  },
} satisfies Record<string, GlossaryEntry>
