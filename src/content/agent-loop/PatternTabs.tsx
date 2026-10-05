import { useState } from 'react'

type Tag = 'thought' | 'action' | 'observation' | 'plan' | 'replan' | 'critique' | 'answer'
type Line = { tag: Tag; label?: string; text: string; code?: boolean }

const TASK = 'The test for parse_date() is failing. Fix it.'

const PATTERNS: Record<'react' | 'plan' | 'reflect', { name: string; lines: Line[]; good: string; watch: string }> = {
  react: {
    name: 'ReAct',
    lines: [
      { tag: 'thought', text: 'I need to see the failure before changing anything.' },
      { tag: 'action', text: 'run_tests("tests/test_dates.py")', code: true },
      { tag: 'observation', text: 'test_iso: expected 2026-03-01, got 2026-01-03' },
      { tag: 'thought', text: 'Day and month are swapped. Let me read the format string.' },
      { tag: 'action', text: 'read_file("dates.py")', code: true },
      { tag: 'observation', text: 'return datetime.strptime(s, "%Y-%d-%m")' },
      { tag: 'action', text: 'edit_file("dates.py", "%Y-%d-%m" → "%Y-%m-%d")', code: true },
      { tag: 'action', text: 'run_tests("tests/test_dates.py")', code: true },
      { tag: 'observation', text: '12 passed' },
      { tag: 'answer', text: 'Fixed: the format string had day and month swapped. All 12 tests pass.' },
    ],
    good: 'Open-ended tasks where each result decides the next step. This is the default loop.',
    watch: 'It only looks one step ahead, so on long tasks it can wander or repeat itself.',
  },
  plan: {
    name: 'Plan-and-execute',
    lines: [
      {
        tag: 'plan',
        text: '1. Run the tests and read the failure  2. Read parse_date()  3. Fix the bug  4. Run the full test suite',
      },
      { tag: 'action', label: 'Step 1', text: 'test_iso: expected 2026-03-01, got 2026-01-03' },
      { tag: 'action', label: 'Step 2', text: 'Format string is "%Y-%d-%m"' },
      { tag: 'action', label: 'Step 3', text: 'Changed it to "%Y-%m-%d"' },
      { tag: 'action', label: 'Step 4', text: '11 passed, 1 failed: test_empty raises ValueError' },
      { tag: 'replan', text: 'Add step 5: return None for an empty string, as the test expects.' },
      { tag: 'action', label: 'Step 5', text: 'Added the empty check; 12 passed' },
      { tag: 'answer', text: 'Fixed the swapped format and the empty-input case. All 12 tests pass.' },
    ],
    good: 'Tasks with a predictable shape. The plan is easy to show a person, and a cheaper model can run each step.',
    watch: 'A plan written before seeing any results can be wrong, so the harness must replan when a step fails.',
  },
  reflect: {
    name: 'Reflection',
    lines: [
      { tag: 'action', label: 'Attempt 1', text: 'Changed "%Y-%d-%m" to "%Y-%m-%d"' },
      { tag: 'observation', text: '11 passed, 1 failed: test_with_time, "2026-03-01T10:00" raises ValueError' },
      {
        tag: 'critique',
        text: 'I only fixed the example in the failing test. The inputs are ISO 8601 and can include a time, so a fixed format string is the wrong approach.',
      },
      { tag: 'action', label: 'Attempt 2', text: 'Use datetime.fromisoformat(s).date() instead' },
      { tag: 'observation', text: '12 passed' },
      { tag: 'answer', text: 'Replaced the format string with fromisoformat, which handles dates with and without a time.' },
    ],
    good: 'Work that can be checked: code with tests, answers against a rubric, drafts against requirements.',
    watch: 'Without a real signal (a failing test, a checker), self-critique often approves its own mistakes.',
  },
}

const TAG_LABEL: Record<Tag, string> = {
  thought: 'Thought',
  action: 'Action',
  observation: 'Observation',
  plan: 'Plan',
  replan: 'Replan',
  critique: 'Critique',
  answer: 'Answer',
}

export function PatternTabs() {
  const [mode, setMode] = useState<keyof typeof PATTERNS>('react')
  const p = PATTERNS[mode]

  return (
    <div className="demo">
      <div className="demo-controls agl-tabs-head">
        <div className="speed" role="group" aria-label="Pattern">
          {(Object.keys(PATTERNS) as (keyof typeof PATTERNS)[]).map((k) => (
            <button key={k} type="button" className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>
              {PATTERNS[k].name}
            </button>
          ))}
        </div>
        <span className="small muted">Task: {TASK}</span>
      </div>
      <ol className="agl-trace" key={mode}>
        {p.lines.map((l, i) => (
          <li key={i} className={`agl-trace-line agl-t-${l.tag}`}>
            <span className="agl-trace-tag">{l.label ?? TAG_LABEL[l.tag]}</span>
            {l.code ? <code>{l.text}</code> : <span>{l.text}</span>}
          </li>
        ))}
      </ol>
      <dl className="agl-proscons">
        <div>
          <dt>Good for</dt>
          <dd>{p.good}</dd>
        </div>
        <div>
          <dt>Watch out</dt>
          <dd>{p.watch}</dd>
        </div>
      </dl>
    </div>
  )
}
