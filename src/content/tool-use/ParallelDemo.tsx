import { useState } from 'react'
import { Code } from '../llm-apis/Code'

/** Three independent lookups from one reply, with made-up but plausible latencies. */
const CALLS = [
  { city: 'Oslo', ms: 900 },
  { city: 'Nairobi', ms: 1400 },
  { city: 'Lima', ms: 700 },
]

const RESULTS = `
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01A…", "content": "Oslo: 4 °C, snow showers"},
  {"type": "tool_result", "tool_use_id": "toolu_01B…", "content": "Nairobi: 24 °C, partly cloudy"},
  {"type": "tool_result", "tool_use_id": "toolu_01C…", "content": "Lima: 19 °C, overcast"}
]}
`

const SEQUENTIAL_MS = CALLS.reduce((sum, c) => sum + c.ms, 0)
/** Where each call starts when they run one after another. */
const OFFSETS = CALLS.map((_, i) => CALLS.slice(0, i).reduce((sum, c) => sum + c.ms, 0))
const PARALLEL_MS = Math.max(...CALLS.map((c) => c.ms))

export function ParallelDemo() {
  const [mode, setMode] = useState<'sequential' | 'parallel'>('sequential')
  const total = mode === 'sequential' ? SEQUENTIAL_MS : PARALLEL_MS

  return (
    <div className="demo">
      <div className="demo-controls tu-controls">
        <div className="speed" role="group" aria-label="Execution">
          <button type="button" className={mode === 'sequential' ? 'on' : ''} onClick={() => setMode('sequential')}>
            One after another
          </button>
          <button type="button" className={mode === 'parallel' ? 'on' : ''} onClick={() => setMode('parallel')}>
            All at once
          </button>
        </div>
        <span className="small muted">
          Tools finish after <strong className="tu-total">{(total / 1000).toFixed(1)} s</strong>
        </span>
      </div>
      <ul className="tu-gantt" aria-label="Tool timings">
        {CALLS.map((c, i) => {
          const left = mode === 'sequential' ? OFFSETS[i] : 0
          return (
            <li key={c.city}>
              <span className="tu-gantt-name">get_weather("{c.city}")</span>
              <span className="tu-gantt-track">
                <span
                  className="tu-gantt-bar"
                  style={{ left: `${(left / SEQUENTIAL_MS) * 100}%`, width: `${(c.ms / SEQUENTIAL_MS) * 100}%` }}
                >
                  {(c.ms / 1000).toFixed(1)} s
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      <span className="api-pane-label">The next request: every result in one user message</span>
      <Code lang="json" code={RESULTS} />
      <p className="demo-note">
        The model asked for all three in one reply to “Compare the weather in Oslo, Nairobi and Lima right now.”
        Each <code>tool_use_id</code> matches one <code>tool_use</code> block, so the order of the results does not
        matter. Latencies are illustrative.
      </p>
    </div>
  )
}
