import { useEffect, useRef, useState } from 'react'

/** Cross-section of an agent harness: the model at the centre, wrapped in the layers around it. */

const C = 200
const CORE_R = 34
const OUTSIDE = 222

type RingId = 'prompt' | 'context' | 'tools' | 'loop' | 'guardrails'

const RINGS: { id: RingId; label: string; r: number; color: string; dash: string; spin: number }[] = [
  { id: 'prompt', label: 'SYSTEM PROMPT', r: 64, color: 'var(--accent)', dash: '2 5', spin: 70 },
  { id: 'context', label: 'CONTEXT', r: 94, color: 'var(--memory)', dash: '10 6', spin: -95 },
  { id: 'tools', label: 'TOOLS', r: 124, color: 'var(--core)', dash: '1 7', spin: 120 },
  { id: 'loop', label: 'AGENT LOOP', r: 154, color: 'var(--planning)', dash: '26 9', spin: -160 },
  { id: 'guardrails', label: 'GUARDRAILS', r: 184, color: 'var(--advanced)', dash: '3 3', spin: 220 },
]
const radius = (id: RingId) => RINGS.find((r) => r.id === id)!.r

const TOOLS = [
  { name: 'search', angle: 22 },
  { name: 'read_file', angle: 128 },
  { name: 'bash', angle: 206 },
  { name: 'edit', angle: 328 },
]

type Seg =
  | {
      kind: 'move'
      angle: number
      from: number
      to: number
      dur: number
      caption: string
      color: string
      flash: RingId[]
      deposit?: boolean
      fade?: 'in' | 'out'
    }
  | { kind: 'think'; dur: number; caption: string; loop?: boolean }
  | { kind: 'tool'; tool: number; dur: number; caption: string }
  | { kind: 'rest'; dur: number }

function buildRun(): Seg[] {
  const enter = 200 + Math.random() * 140
  const calls = [...TOOLS.keys()].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3))
  const segs: Seg[] = [
    {
      kind: 'move',
      angle: enter,
      from: OUTSIDE,
      to: CORE_R,
      dur: 2000,
      caption: 'user message',
      color: 'var(--text)',
      flash: ['guardrails', 'context', 'prompt'],
      fade: 'in',
    },
    { kind: 'think', dur: 1300, caption: 'model thinking…' },
  ]
  for (const i of calls) {
    const { name, angle } = TOOLS[i]
    const toolR = radius('tools')
    segs.push(
      { kind: 'move', angle, from: CORE_R, to: toolR, dur: 900, caption: `tool_use · ${name}`, color: 'var(--core)', flash: ['tools'] },
      { kind: 'tool', tool: i, dur: 800, caption: `running ${name}…` },
      {
        kind: 'move',
        angle,
        from: toolR,
        to: CORE_R,
        dur: 1000,
        caption: 'tool_result → context',
        color: 'var(--memory)',
        flash: ['context'],
        deposit: true,
      },
      { kind: 'think', dur: 1100, caption: 'next turn of the loop', loop: true },
    )
  }
  segs.push(
    {
      kind: 'move',
      angle: (enter + 180) % 360,
      from: CORE_R,
      to: OUTSIDE,
      dur: 2000,
      caption: 'end_turn · final answer',
      color: 'var(--accent)',
      flash: ['guardrails'],
      fade: 'out',
    },
    { kind: 'rest', dur: 1800 },
  )
  return segs
}

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2)
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const
}

function restart(el: Element | null | undefined, cls: string) {
  if (!el) return
  el.classList.remove(cls)
  void (el as SVGElement).getBoundingClientRect()
  el.classList.add(cls)
}

export function HarnessDiagram() {
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [caption, setCaption] = useState('')
  const [deposits, setDeposits] = useState<{ id: number; angle: number }[]>([])

  const rootRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<SVGGElement>(null)
  const packetRef = useRef<SVGGElement>(null)
  const trailRef = useRef<SVGLineElement>(null)
  const glowRefs = useRef<Partial<Record<RingId, SVGCircleElement | null>>>({})
  const toolRefs = useRef<(SVGGElement | null)[]>([])

  useEffect(() => {
    if (reduced) return
    const packet = packetRef.current!
    const trail = trailRef.current!
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(rootRef.current!)

    let segs = buildRun()
    let i = 0
    let t = 0
    let crossed = new Set<RingId>()
    let last = performance.now()
    let raf = 0
    let depositId = 0

    const begin = () => {
      const seg = segs[i]
      crossed = new Set()
      if (seg.kind !== 'rest') setCaption(seg.caption)
      packet.style.opacity = seg.kind === 'move' ? '1' : '0'
      trail.style.opacity = '0'
      if (seg.kind === 'move') packet.style.setProperty('--pc', seg.color)
      if (seg.kind === 'think') {
        coreRef.current?.classList.add('thinking')
        if (seg.loop) restart(glowRefs.current.loop, 'hit')
      }
      if (seg.kind === 'tool') restart(toolRefs.current[seg.tool], 'hit')
      if (seg.kind === 'rest') setDeposits([])
    }
    const end = () => {
      if (segs[i].kind === 'think') coreRef.current?.classList.remove('thinking')
    }

    const frame = (now: number) => {
      const dt = visible && !document.hidden ? Math.min(now - last, 50) : 0
      last = now
      t += dt
      const seg = segs[i]
      const p = Math.min(1, t / seg.dur)

      if (seg.kind === 'move') {
        const r = seg.from + (seg.to - seg.from) * ease(p)
        const dir = Math.sign(seg.to - seg.from)
        const [x, y] = polar(r, seg.angle)
        const [tx, ty] = polar(Math.max(CORE_R, r - dir * 26), seg.angle)
        packet.setAttribute('transform', `translate(${x} ${y})`)
        trail.setAttribute('x1', String(tx))
        trail.setAttribute('y1', String(ty))
        trail.setAttribute('x2', String(x))
        trail.setAttribute('y2', String(y))
        trail.style.setProperty('--pc', seg.color)
        const o = seg.fade === 'in' ? Math.min(1, p * 4) : seg.fade === 'out' ? Math.min(1, (1 - p) * 4) : 1
        packet.style.opacity = String(o)
        trail.style.opacity = String(o * 0.45)

        for (const id of seg.flash) {
          const ringR = radius(id)
          if (!crossed.has(id) && (r - ringR) * dir >= 0) {
            crossed.add(id)
            restart(glowRefs.current[id], 'hit')
            if (id === 'context' && seg.deposit) {
              const angle = seg.angle
              setDeposits((d) => [...d, { id: depositId++, angle }])
            }
          }
        }
      }

      if (p >= 1) {
        end()
        i += 1
        t = 0
        if (i >= segs.length) {
          segs = buildRun()
          i = 0
        }
        begin()
      }
      raf = requestAnimationFrame(frame)
    }

    begin()
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [reduced])

  return (
    <div className="harness" ref={rootRef}>
      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-label="Cross-section of an agent harness: the model at the centre, wrapped by the system prompt, context, tools, the agent loop, and guardrails."
      >
        <defs>
          {RINGS.map(({ id, r }) => (
            <path key={id} id={`h-arc-${id}`} d={`M ${C - r} ${C} A ${r} ${r} 0 0 1 ${C + r} ${C}`} />
          ))}
        </defs>

        {RINGS.map(({ id, r, color, dash, spin }) => (
          <g key={id} style={{ '--ring': color } as React.CSSProperties}>
            <circle
              className="h-track"
              cx={C}
              cy={C}
              r={r}
              strokeDasharray={dash}
              style={{ animationDuration: `${Math.abs(spin)}s`, animationDirection: spin < 0 ? 'reverse' : 'normal' }}
            />
            <circle
              className="h-glow"
              cx={C}
              cy={C}
              r={r}
              ref={(el) => {
                glowRefs.current[id] = el
              }}
            />
          </g>
        ))}

        <g className="h-deposits">
          {deposits.map((d) => {
            const [x, y] = polar(radius('context'), d.angle)
            return <circle key={d.id} className="h-deposit" cx={x} cy={y} r={3.5} />
          })}
        </g>

        {['h-label-knockout', 'h-label'].map((cls) =>
          RINGS.map(({ id, label }) => (
            <text key={`${cls}-${id}`} className={cls} dominantBaseline="central" aria-hidden={cls !== 'h-label'}>
              <textPath href={`#h-arc-${id}`} startOffset="50%" textAnchor="middle">
                {label}
              </textPath>
            </text>
          )),
        )}

        {TOOLS.map(({ name, angle }, i) => {
          const [x, y] = polar(radius('tools'), angle)
          const right = Math.cos((angle * Math.PI) / 180) >= 0
          return (
            <g
              key={name}
              className="h-tool"
              ref={(el) => {
                toolRefs.current[i] = el
              }}
            >
              <circle className="h-tool-pulse" cx={x} cy={y} r={5} />
              <circle className="h-tool-node" cx={x} cy={y} r={4.5} />
              <text className="h-tool-label" x={x + (right ? 9 : -9)} y={y} textAnchor={right ? 'start' : 'end'} dominantBaseline="central">
                {name}
              </text>
            </g>
          )
        })}

        <line ref={trailRef} className="h-trail" />
        <g ref={packetRef} className="h-packet" style={{ opacity: 0 }}>
          <circle r={8} className="h-packet-halo" />
          <circle r={3.75} />
        </g>

        <g ref={coreRef} className="h-core">
          <circle className="h-halo" cx={C} cy={C} r={CORE_R} />
          <circle className="h-core-body" cx={C} cy={C} r={CORE_R} />
          <text className="h-core-label" x={C} y={C} textAnchor="middle" dominantBaseline="central">
            MODEL
          </text>
        </g>
      </svg>
      {!reduced && (
        <div className="harness-caption" aria-hidden="true">
          {caption}
        </div>
      )}
    </div>
  )
}
