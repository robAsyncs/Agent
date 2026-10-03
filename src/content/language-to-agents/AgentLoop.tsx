import { useEffect, useRef, useState } from 'react'

type NodeId = 'task' | 'think' | 'act' | 'observe' | 'answer'
type EdgeId = 'start' | 'use' | 'result' | 'context' | 'done'

const EDGES: Record<EdgeId, { d: string; label: string; lx: number; ly: number; anchor?: 'start' | 'end' }> = {
  start: { d: 'M102 52H216', label: '', lx: 0, ly: 0 },
  use: { d: 'M350 80Q420 120 430 186', label: 'tool_use', lx: 448, ly: 146, anchor: 'start' },
  result: { d: 'M348 218H252', label: 'tool_result', lx: 300, ly: 238 },
  context: { d: 'M170 186Q180 120 228 80', label: 'new context', lx: 150, ly: 120, anchor: 'end' },
  done: { d: 'M384 52H498', label: 'done', lx: 441, ly: 42 },
}

const NODES: { id: NodeId; x: number; y: number; title: string; sub?: string }[] = [
  { id: 'task', x: 55, y: 52, title: 'Task' },
  { id: 'think', x: 300, y: 52, title: 'Think', sub: 'model picks next step' },
  { id: 'act', x: 430, y: 218, title: 'Act', sub: 'harness runs the tool' },
  { id: 'observe', x: 170, y: 218, title: 'Observe', sub: 'result joins the context' },
  { id: 'answer', x: 545, y: 52, title: 'Answer' },
]

/** A two-tool task. Each stage travels one edge and lands on one node; `iteration` is the model call. */
const STAGES: { edge: EdgeId; node: NodeId; iteration: number; caption: string }[] = [
  { edge: 'start', node: 'think', iteration: 1, caption: 'Task: “Plan a picnic in Melbourne tomorrow.” The model reads it.' },
  { edge: 'use', node: 'act', iteration: 1, caption: 'The model needs the forecast, so it replies with get_weather(...).' },
  { edge: 'result', node: 'observe', iteration: 1, caption: 'The harness runs the tool: sunny, 24 °C.' },
  { edge: 'context', node: 'think', iteration: 2, caption: 'The result is added to the context and the model is called again.' },
  { edge: 'use', node: 'act', iteration: 2, caption: 'Now it wants places to go: find_parks(...).' },
  { edge: 'result', node: 'observe', iteration: 2, caption: 'The harness returns three parks with shade and picnic areas.' },
  { edge: 'context', node: 'think', iteration: 3, caption: 'Back to the model with both results in context.' },
  { edge: 'done', node: 'answer', iteration: 3, caption: 'It has enough to answer, so it stops calling tools. The loop ends.' },
]

const STAGE_MS = 2200
const END_PAUSE_MS = 2600

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A dot that travels along one edge once, starting when it mounts. */
function Traveler({ d }: { d: string }) {
  const ref = useRef<SVGAnimateMotionElement>(null)
  useEffect(() => {
    ref.current?.beginElement()
  }, [])
  return (
    <circle r={5} className="dg-dot">
      <animateMotion
        ref={ref}
        path={d}
        dur="0.9s"
        begin="indefinite"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.4 0 0.2 1"
      />
    </circle>
  )
}

/** Think → act → observe, entered with a task and exited with an answer. */
export function AgentLoop() {
  const [stage, setStage] = useState(-1)
  const [cycle, setCycle] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [still] = useState(reducedMotion)
  const rootRef = useRef<HTMLDivElement>(null)

  // Start when the diagram scrolls into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el || still) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPlaying(true)
        io.disconnect()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [still])

  useEffect(() => {
    if (!playing) return
    const last = stage === STAGES.length - 1
    const id = setTimeout(
      () => {
        if (last) setCycle((c) => c + 1)
        setStage(last ? 0 : stage + 1)
      },
      stage === -1 ? 300 : last ? END_PAUSE_MS : STAGE_MS,
    )
    return () => clearTimeout(id)
  }, [playing, stage])

  const current = stage >= 0 ? STAGES[stage] : undefined

  return (
    <div className="loop" ref={rootRef}>
      <svg className="diagram" viewBox="0 0 600 270" role="img" aria-labelledby="loop-title">
        <title id="loop-title">
          The agent loop: the model thinks, the harness acts, the result is observed, until the model answers.
        </title>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10z" className="dg-head" />
          </marker>
          <marker id="arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10z" className="dg-head on" />
          </marker>
        </defs>

        {(Object.keys(EDGES) as EdgeId[]).map((id) => {
          const e = EDGES[id]
          const on = still || current?.edge === id
          return (
            <g key={id}>
              <path d={e.d} className="dg-edge" markerEnd="url(#arrow)" />
              {on && (
                <path
                  key={`${cycle}-${stage}`}
                  d={e.d}
                  pathLength={1}
                  className={`dg-edge on ${still ? '' : 'drawing'}`}
                  markerEnd="url(#arrow-on)"
                />
              )}
              {e.label && (
                <text x={e.lx} y={e.ly} className={`dg-label ${on ? 'on' : ''}`} textAnchor={e.anchor}>
                  {e.label}
                </text>
              )}
            </g>
          )
        })}

        {NODES.map((n) => {
          const pill = !n.sub
          const w = pill ? 90 : 160
          const h = pill ? 44 : 54
          const on = current?.node === n.id
          return (
            <g key={n.id} className={`dg-node-g ${on ? 'on' : ''}`}>
              <rect
                x={n.x - w / 2}
                y={n.y - h / 2}
                width={w}
                height={h}
                rx={pill ? h / 2 : 14}
                className={pill ? 'dg-pill' : 'dg-node'}
              />
              <text x={n.x} y={pill ? n.y + 5 : n.y - 4} className="dg-title">
                {n.title}
              </text>
              {n.sub && (
                <text x={n.x} y={n.y + 14} className="dg-sub">
                  {n.sub}
                </text>
              )}
            </g>
          )
        })}

        {current && <Traveler key={`${cycle}-${stage}`} d={EDGES[current.edge].d} />}

        {current && current.node !== 'answer' && (
          <text x={300} y={150} className="dg-iter">
            model call {current.iteration}
          </text>
        )}
      </svg>

      {!still && (
        <div className="loop-bar">
          <button
            type="button"
            className="loop-toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
              <path d={playing ? 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z' : 'M7 4.5v15l12-7.5z'} fill="currentColor" />
            </svg>
          </button>
          <p className="loop-caption" aria-live="polite">
            {current?.caption ?? 'The model decides; the harness acts.'}
          </p>
          <ol className="loop-steps" aria-hidden="true">
            {STAGES.map((_, i) => (
              <li key={i} className={i === stage ? 'on' : i < stage ? 'past' : ''} />
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
