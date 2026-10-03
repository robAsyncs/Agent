import { useState } from 'react'

type Part = 'role' | 'task' | 'data' | 'format' | 'plain'
type Seg = { part: Part; text: string }

const EMAIL =
  'Hi, I ordered the blue backpack (order #4471) two weeks ago and it still hasn\'t arrived. Tracking has said "in transit" since the 3rd. I need it before my trip on Friday. Can you help? – Sara'

const VERSIONS: Record<'vague' | 'specific', { system?: Seg[]; user: Seg[]; output: string }> = {
  vague: {
    user: [{ part: 'plain', text: `Summarize this:\n\n${EMAIL}` }],
    output:
      'Sara is writing about a blue backpack she ordered two weeks ago. She says it has not arrived yet and that the tracking page has shown "in transit" since the 3rd. She mentions that she has a trip on Friday and needs the backpack before then, and she is asking for help.',
  },
  specific: {
    system: [
      {
        part: 'role',
        text: 'You are a support triage assistant for an online store. Agents read your tickets in under ten seconds, so be brief and concrete.',
      },
    ],
    user: [
      { part: 'task', text: 'Turn the customer email into a ticket.\n\n' },
      { part: 'data', text: `<email>\n${EMAIL}\n</email>\n\n` },
      {
        part: 'format',
        text: 'Use exactly this format:\n<example>\nIssue: Damaged item, order #1032\nUrgency: Normal\nAction: Send a return label\n</example>',
      },
    ],
    output:
      'Issue: Late delivery, order #4471 (in transit since the 3rd)\nUrgency: High (needed before Friday)\nAction: Check carrier status; offer an expedited replacement if it has not moved by Wednesday',
  },
}

const LEGEND: { part: Exclude<Part, 'plain'>; label: string }[] = [
  { part: 'role', label: 'Role' },
  { part: 'task', label: 'Clear task' },
  { part: 'data', label: 'Data in XML tags' },
  { part: 'format', label: 'Format example' },
]

function Segments({ segs }: { segs: Seg[] }) {
  return segs.map((s, i) => (
    <span key={i} className={s.part === 'plain' ? '' : `api-seg api-seg-${s.part}`}>
      {s.text}
    </span>
  ))
}

export function PromptCompare() {
  const [mode, setMode] = useState<'vague' | 'specific'>('vague')
  const v = VERSIONS[mode]

  return (
    <div className="demo api-compare">
      <div className="demo-controls">
        <div className="speed" role="group" aria-label="Prompt version">
          <button type="button" className={mode === 'vague' ? 'on' : ''} onClick={() => setMode('vague')}>
            Vague prompt
          </button>
          <button type="button" className={mode === 'specific' ? 'on' : ''} onClick={() => setMode('specific')}>
            Engineered prompt
          </button>
        </div>
      </div>

      <div className="api-compare-cols" key={mode}>
        <div className="api-compare-prompt">
          {v.system && (
            <div className="api-msg">
              <span className="api-msg-role">system</span>
              <p>
                <Segments segs={v.system} />
              </p>
            </div>
          )}
          <div className="api-msg">
            <span className="api-msg-role">user</span>
            <p>
              <Segments segs={v.user} />
            </p>
          </div>
          {mode === 'specific' && (
            <ul className="api-legend">
              {LEGEND.map((l) => (
                <li key={l.part} className={`api-seg-${l.part}`}>
                  {l.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="api-compare-output">
          <span className="api-pane-label">Example output (illustrative)</span>
          <p>{v.output}</p>
          <span className="api-compare-verdict">
            {mode === 'vague'
              ? 'Accurate, but a paraphrase. An agent still has to read it all to find the order and the deadline.'
              : 'Same model, same email. The format makes it scannable, and the code that stores tickets can parse it.'}
          </span>
        </div>
      </div>
    </div>
  )
}
