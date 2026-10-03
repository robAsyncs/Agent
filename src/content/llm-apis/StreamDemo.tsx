import { useEffect, useRef, useState } from 'react'

/** Text chunks as they might arrive in text_delta events. */
const CHUNKS = ['Grey clouds', ' over rooftops', ' —\nthe afternoon', ' rain arrives', '\nright on', ' time again.']

type Ev = { name: string; data: string; text?: string; done?: boolean }

const EVENTS: Ev[] = [
  {
    name: 'message_start',
    data: '{"type":"message_start","message":{"id":"msg_01…","role":"assistant","model":"claude-opus-5-5","content":[],"stop_reason":null,"usage":{"input_tokens":19,"output_tokens":1}}}',
  },
  { name: 'content_block_start', data: '{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}' },
  { name: 'ping', data: '{"type":"ping"}' },
  ...CHUNKS.map((text) => ({
    name: 'content_block_delta',
    data: `{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":${JSON.stringify(text)}}}`,
    text,
  })),
  { name: 'content_block_stop', data: '{"type":"content_block_stop","index":0}' },
  {
    name: 'message_delta',
    data: '{"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":22}}',
    done: true,
  },
  { name: 'message_stop', data: '{"type":"message_stop"}' },
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function StreamDemo() {
  const [shown, setShown] = useState(() => (reducedMotion() ? EVENTS.length : 0))
  const [run, setRun] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLOListElement>(null)

  // Start when scrolled into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el || reducedMotion()) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setRun(1)
        io.disconnect()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (run === 0 || shown >= EVENTS.length) return
    const next = EVENTS[shown]
    const delay = shown === 0 ? 500 : next.name === 'content_block_delta' ? 260 + Math.random() * 220 : 600
    const id = setTimeout(() => setShown((s) => s + 1), delay)
    return () => clearTimeout(id)
  }, [run, shown])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [shown])

  const visible = EVENTS.slice(0, shown)
  const text = visible.map((e) => e.text ?? '').join('')
  const streaming = shown > 0 && shown < EVENTS.length
  const done = visible.some((e) => e.done)

  return (
    <div className="demo api-stream" ref={rootRef}>
      <div className="api-stream-cols">
        <div className="api-stream-pane">
          <span className="api-pane-label">Server-sent events</span>
          <ol className="api-events" ref={logRef}>
            {visible.map((e, i) => (
              <li key={i} className={`api-event api-ev-${e.name}`}>
                <span className="api-event-name">event: {e.name}</span>
                <span className="api-event-data">data: {e.data}</span>
              </li>
            ))}
            {shown === 0 && <li className="api-events-empty">Waiting for the first event…</li>}
          </ol>
        </div>
        <div className="api-stream-pane">
          <span className="api-pane-label">What your app shows</span>
          <p className="api-stream-text">
            {text}
            {streaming && <span className="chat-cursor" />}
          </p>
          {done && (
            <div className="api-stream-meta">
              <span>
                stop_reason <code>end_turn</code>
              </span>
              <span>
                output_tokens <code>22</code>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="demo-controls">
        <button
          type="button"
          className="pill primary"
          disabled={streaming}
          onClick={() => {
            setShown(0)
            setRun((r) => r + 1)
          }}
        >
          {run === 0 && shown === 0 ? 'Start stream' : 'Replay'}
        </button>
        <span className="small muted">
          {shown} / {EVENTS.length} events
        </span>
      </div>
      <p className="demo-note">
        Event names and shapes follow the Messages API; ids and token counts are illustrative, and long{' '}
        <code>data</code> lines are abridged. A response with thinking or tool calls streams those as extra content
        blocks with their own start, delta and stop events.
      </p>
    </div>
  )
}
