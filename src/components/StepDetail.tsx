import { CONCEPT_BY_KIND } from '../data/concepts'
import { CATEGORIES, LANES } from '../data/meta'
import type { ActionKind, Step } from '../types'
import { Payload } from './Payload'

const laneLabel = Object.fromEntries(LANES.map((l) => [l.id, l.label]))

interface Props {
  step?: Step
  index: number
  total: number
  onLearnMore: (kind: ActionKind) => void
}

export function StepDetail({ step, index, total, onLearnMore }: Props) {
  if (!step) {
    return (
      <section className="panel detail">
        <h3>Step details</h3>
        <p className="muted">
          Each step of the run appears here: what happened, why, and the raw data that was exchanged.
        </p>
      </section>
    )
  }
  const concept = CONCEPT_BY_KIND[step.kind]
  const route = step.from === step.to ? `inside ${laneLabel[step.from]}` : `${laneLabel[step.from]} → ${laneLabel[step.to]}`

  return (
    <section className={`panel detail cat-${concept.category}`}>
      <div className="detail-top">
        <span className="badge">{CATEGORIES[concept.category].label}</span>
        <span className="muted small">
          Step {index + 1} / {total} · {route}
        </span>
      </div>
      <h3>{concept.title}</h3>
      <p>{step.note}</p>
      <Payload value={step.payload} />
      <button type="button" className="link" onClick={() => onLearnMore(step.kind)}>
        Learn about “{concept.title}” →
      </button>
    </section>
  )
}
