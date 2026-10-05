import type { CSSProperties } from 'react'

const LEVELS: { title: string; decides: string; example: string }[] = [
  {
    title: 'Single call',
    decides: 'Your code does everything; the model fills in one answer.',
    example: 'Summarize this email.',
  },
  {
    title: 'Workflow',
    decides: 'Your code fixes the steps; the model does each one.',
    example: 'Classify a ticket, then route it to the matching prompt.',
  },
  {
    title: 'Agent with approval',
    decides: 'The model picks each step; a person approves risky ones.',
    example: 'A coding agent that asks before editing files.',
  },
  {
    title: 'Autonomous agent',
    decides: 'The model picks every step until the task is done.',
    example: 'A research agent that searches until it can answer.',
  },
]

/** From fixed code paths to model-chosen steps. */
export function AutonomySpectrum() {
  return (
    <div className="agl-spectrum">
      <ol>
        {LEVELS.map((l, i) => (
          <li key={l.title} style={{ '--lvl': i / (LEVELS.length - 1) } as CSSProperties}>
            <strong>{l.title}</strong>
            <span>{l.decides}</span>
            <em>“{l.example}”</em>
          </li>
        ))}
      </ol>
      <div className="agl-spectrum-axis" aria-hidden="true">
        <span>Predictable, cheap, easy to test</span>
        <span>Flexible, open-ended, harder to control</span>
      </div>
    </div>
  )
}
