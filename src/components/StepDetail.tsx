import { Link } from 'react-router'
import { CONCEPT_BY_KIND } from '../data/concepts'
import { CATEGORIES, LANES } from '../data/meta'
import type { Step } from '../types'
import { Payload } from './Payload'

const laneLabel = Object.fromEntries(LANES.map((l) => [l.id, l.label]))

interface Props {
  step?: Step
  index: number
  total: number
}

export function StepDetail({ step, index, total }: Props) {
  if (!step) {
    return (
      <section className="panel detail">
        <h3>Step details</h3>
        <p className="muted">Press play to start.</p>
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
      <Link className="link" to={`/reference/${step.kind}`}>
        Learn more →
      </Link>
    </section>
  )
}
