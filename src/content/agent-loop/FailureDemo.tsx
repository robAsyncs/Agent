import { useState } from 'react'

type Tag = 'action' | 'observation' | 'answer' | 'harness'
type Line = { tag: Tag; text: string; code?: boolean }

const FAILURES: Record<'repeat' | 'false' | 'misuse', { name: string; lines: Line[]; fix: string }> = {
  repeat: {
    name: 'Repeating itself',
    lines: [
      { tag: 'action', text: 'web_search("Reykjavík population exact 2026")', code: true },
      { tag: 'observation', text: 'No results with an exact 2026 figure.' },
      { tag: 'action', text: 'web_search("Reykjavík population exact 2026")', code: true },
      { tag: 'observation', text: 'No results with an exact 2026 figure.' },
      { tag: 'action', text: 'web_search("Reykjavík population exact 2026")', code: true },
      {
        tag: 'harness',
        text: 'This exact call has run 3 times with the same result. Try a different query, or answer with what you have and say what is uncertain.',
      },
      { tag: 'action', text: 'web_search("Reykjavík population")', code: true },
      { tag: 'observation', text: '“Reykjavík has a population of around 140,000.”' },
    ],
    fix: 'Keep a count of (tool, input) pairs. On a repeat, run nothing and return a note saying so. A hard max_iterations still backs this up.',
  },
  false: {
    name: 'Claiming false success',
    lines: [
      { tag: 'action', text: 'edit_file("dates.py", "%Y-%d-%m" → "%Y-%m-%d")', code: true },
      { tag: 'observation', text: 'File updated.' },
      { tag: 'answer', text: 'Done! The bug is fixed and all tests pass.' },
      {
        tag: 'harness',
        text: 'Ran the tests before accepting the answer: 11 passed, 1 failed (test_with_time). The task is not finished.',
      },
      { tag: 'action', text: 'read_file("tests/test_dates.py")', code: true },
    ],
    fix: 'Don’t take “done” on trust. Check it against the environment: run the tests, re-read the file, query the database. Then feed the evidence back.',
  },
  misuse: {
    name: 'Misusing a tool',
    lines: [
      { tag: 'action', text: 'calculate("18% of 2450")', code: true },
      {
        tag: 'observation',
        text: 'is_error: Only numbers and + - * / ** are allowed. Write a percentage as multiplication, e.g. "2450 * 0.18".',
      },
      { tag: 'action', text: 'calculate("2450 * 0.18")', code: true },
      { tag: 'observation', text: '441.0' },
      { tag: 'action', text: 'run_shell("rm -rf build/")', code: true },
      {
        tag: 'harness',
        text: 'Blocked: run_shell only allows pytest and ls. Ask the user if something else is needed.',
      },
    ],
    fix: 'Clear descriptions, schema checks and actionable errors fix honest mistakes. Permission checks in the harness stop the dangerous ones, whatever the model intended.',
  },
}

const TAG_LABEL: Record<Tag, string> = {
  action: 'Action',
  observation: 'Observation',
  answer: 'Answer',
  harness: 'Harness',
}

export function FailureDemo() {
  const [mode, setMode] = useState<keyof typeof FAILURES>('repeat')
  const f = FAILURES[mode]

  return (
    <div className="demo">
      <div className="demo-controls agl-tabs-head">
        <div className="speed" role="group" aria-label="Failure mode">
          {(Object.keys(FAILURES) as (keyof typeof FAILURES)[]).map((k) => (
            <button key={k} type="button" className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>
              {FAILURES[k].name}
            </button>
          ))}
        </div>
      </div>
      <ol className="agl-trace" key={mode}>
        {f.lines.map((l, i) => (
          <li key={i} className={`agl-trace-line agl-t-${l.tag}`}>
            <span className="agl-trace-tag">{TAG_LABEL[l.tag]}</span>
            {l.code ? <code>{l.text}</code> : <span>{l.text}</span>}
          </li>
        ))}
      </ol>
      <dl className="agl-proscons">
        <div>
          <dt>Fix in the harness</dt>
          <dd>{f.fix}</dd>
        </div>
      </dl>
    </div>
  )
}
