import { useEffect, useRef } from 'react'
import { CONCEPT_BY_KIND } from '../data/concepts'
import { LANES } from '../data/meta'
import type { Step } from '../types'

interface Props {
  steps: Step[]
  /** Steps with index <= revealedUntil are shown. */
  revealedUntil: number
  activeIndex: number
  onSelect?: (index: number) => void
  emptyHint?: string
}

const laneIndex = Object.fromEntries(LANES.map((lane, i) => [lane.id, i]))
const center = (i: number) => ((i + 0.5) / LANES.length) * 100

export function Timeline({ steps, revealedUntil, activeIndex, onSelect, emptyHint }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeIndex])

  const visible = steps.slice(0, revealedUntil + 1)

  return (
    <div className="timeline">
      <div className="timeline-lanes">
        {LANES.map((lane) => (
          <div key={lane.id} className={`lane-head lane-${lane.id}`} title={lane.hint}>
            {lane.label}
          </div>
        ))}
      </div>

      <div className="timeline-body">
        {LANES.map((lane, i) => (
          <div key={lane.id} className="lifeline" style={{ left: `${center(i)}%` }} />
        ))}

        {visible.length === 0 && (
          <div className="timeline-empty">
            <span>{emptyHint ?? 'Press play or → to start'}</span>
          </div>
        )}

        {visible.map((step, i) => {
          const from = laneIndex[step.from]
          const to = laneIndex[step.to]
          const category = CONCEPT_BY_KIND[step.kind].category
          const isActive = i === activeIndex
          const isSelf = from === to
          const left = center(Math.min(from, to))
          const width = Math.abs(center(to) - center(from))

          return (
            <button
              key={i}
              ref={isActive ? activeRef : undefined}
              type="button"
              className={`row cat-${category} ${isActive ? 'active' : ''} ${i < activeIndex ? 'past' : ''}`}
              onClick={() => onSelect?.(i)}
              aria-label={`Step ${i + 1}: ${step.label}`}
            >
              <span className="row-num">{i + 1}</span>
              {isSelf ? (
                <span className="self" style={{ left: `${center(from)}%` }}>
                  <span className="self-kind">{CONCEPT_BY_KIND[step.kind].title}</span>
                  <span className="self-label">{step.label}</span>
                </span>
              ) : (
                <>
                  <span
                    className={`arrow ${to > from ? 'right' : 'left'}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span className="arrow-label" style={{ left: `${left + width / 2}%` }}>
                    {step.label}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
