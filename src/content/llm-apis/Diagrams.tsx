import { Code } from './Code'

const REQUEST = `
POST https://api.anthropic.com/v1/messages
x-api-key: $ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
content-type: application/json

{
  "model": "claude-opus-5-5",
  "max_tokens": 1024,
  "system": "Be concise.",
  "messages": [
    {"role": "user",
     "content": "Capital of Australia?"}
  ]
}
`

const RESPONSE = `
{
  "id": "msg_01…",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-5-5",
  "content": [
    {"type": "text",
     "text": "Canberra."}
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 18,
    "output_tokens": 6
  }
}
`

/** One request out, one response back. */
export function RoundTrip() {
  return (
    <div className="api-roundtrip">
      <div>
        <span className="api-pane-label">Request: your code</span>
        <Code lang="json" code={REQUEST} />
      </div>
      <div className="api-roundtrip-arrows" aria-hidden="true">
        <span>→</span>
        <span>←</span>
      </div>
      <div>
        <span className="api-pane-label">Response: 200 OK</span>
        <Code lang="json" code={RESPONSE} />
      </div>
    </div>
  )
}

/** Attempts at t = 0, ~1, ~3, ~7 seconds: each wait doubles, with a little random jitter. */
const ATTEMPTS = [
  { t: 0, ok: false },
  { t: 1.2, ok: false },
  { t: 3.4, ok: false },
  { t: 7.7, ok: true },
]
const SPAN = 9

export function BackoffTimeline() {
  const x = (t: number) => 30 + (t / SPAN) * 540
  return (
    <svg className="diagram" viewBox="0 0 600 130" role="img" aria-labelledby="backoff-title">
      <title id="backoff-title">
        Exponential backoff: three 429 responses with waits of about 1, 2 and 4 seconds, then a 200.
      </title>
      <line x1={30} y1={70} x2={570} y2={70} className="api-axis" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
        <g key={s}>
          <line x1={x(s)} y1={66} x2={x(s)} y2={74} className="api-axis" />
          <text x={x(s)} y={92} className="dg-label">
            {s}s
          </text>
        </g>
      ))}
      {ATTEMPTS.slice(0, -1).map((a, i) => (
        <g key={i}>
          <rect
            x={x(a.t) + 6}
            y={58}
            width={x(ATTEMPTS[i + 1].t) - x(a.t) - 12}
            height={24}
            rx={6}
            className="api-wait"
          />
          <text x={(x(a.t) + x(ATTEMPTS[i + 1].t)) / 2} y={115} className="dg-label">
            wait ≈{2 ** i}s
          </text>
        </g>
      ))}
      {ATTEMPTS.map((a, i) => (
        <g key={i}>
          <circle cx={x(a.t)} cy={70} r={9} className={a.ok ? 'api-hit-ok' : 'api-hit-fail'} />
          <text x={x(a.t)} y={40} className={`api-hit-label ${a.ok ? 'ok' : ''}`}>
            {a.ok ? '200' : '429'}
          </text>
        </g>
      ))}
    </svg>
  )
}

const BLOCKS = [
  { label: 'tools', w: 10 },
  { label: 'system', w: 12 },
  { label: 'reference document', w: 44 },
  { label: 'history', w: 18 },
  { label: 'new question', w: 16 },
]

const ROWS: { title: string; states: ('write' | 'read' | 'miss' | 'plain')[]; note: string }[] = [
  { title: 'Request 1', states: ['write', 'write', 'write', 'plain', 'plain'], note: 'prefix written to the cache' },
  { title: 'Request 2', states: ['read', 'read', 'read', 'plain', 'plain'], note: 'same prefix: read from the cache' },
  {
    title: 'System prompt edited',
    states: ['read', 'miss', 'miss', 'plain', 'plain'],
    note: 'one changed byte: everything after it is processed again',
  },
]

/** Caching is a prefix match over the request, in order: tools, system, messages. */
export function CacheDiagram() {
  return (
    <div className="api-cache">
      {ROWS.map((row) => (
        <div key={row.title} className="api-cache-row">
          <span className="api-cache-title">{row.title}</span>
          <div className="api-cache-bar">
            {BLOCKS.map((b, i) => (
              <span key={b.label} className={`api-block api-block-${row.states[i]}`} style={{ flexGrow: b.w }}>
                {b.label}
              </span>
            ))}
          </div>
          <span className="api-cache-note">{row.note}</span>
        </div>
      ))}
      <ul className="api-legend">
        <li className="api-block-write">cache write</li>
        <li className="api-block-read">cache read</li>
        <li className="api-block-miss">re-processed</li>
        <li className="api-block-plain">regular input</li>
      </ul>
    </div>
  )
}
