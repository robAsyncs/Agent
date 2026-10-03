import { Link } from 'react-router'
import { CONCEPT_BY_KIND, CONCEPTS } from '../data/concepts'
import { CATEGORIES } from '../data/meta'
import { occurrencesOf } from '../data/scenarios'
import type { ActionKind, Category } from '../types'
import { Payload } from './Payload'
import { Timeline } from './Timeline'

const GROUPS: Category[] = ['core', 'planning', 'memory']
const ADVANCED_PREVIEW = ['Subagents / handoff', 'Reflection', 'Guardrails', 'Human-in-the-loop']

export function Explorer({ selected }: { selected: ActionKind }) {
  const concept = CONCEPT_BY_KIND[selected]
  const seenIn = occurrencesOf(selected)
  // One link per scenario, pointing at the first occurrence.
  const firstPerScenario = seenIn.filter((o, i) => seenIn.findIndex((x) => x.scenario.id === o.scenario.id) === i)
  const exampleLast = concept.example.steps.length - 1

  return (
    <div className="explorer">
      <nav className="concept-nav" aria-label="Agent actions">
        {GROUPS.map((cat) => (
          <div key={cat} className={`concept-group cat-${cat}`}>
            <h4>{CATEGORIES[cat].label}</h4>
            {CONCEPTS.filter((c) => c.category === cat).map((c) => (
              <Link
                key={c.kind}
                to={`/reference/${c.kind}`}
                className={c.kind === selected ? 'on' : ''}
                aria-current={c.kind === selected ? 'page' : undefined}
              >
                {c.title}
              </Link>
            ))}
          </div>
        ))}
        <div className="concept-group cat-advanced">
          <h4>
            {CATEGORIES.advanced.label} <span className="soon">soon</span>
          </h4>
          {ADVANCED_PREVIEW.map((label) => (
            <button key={label} type="button" disabled>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <article className={`concept cat-${concept.category}`}>
        <span className="badge">{CATEGORIES[concept.category].label}</span>
        <h2>{concept.title}</h2>
        <p className="lead">{concept.summary}</p>

        <Timeline
          key={concept.kind}
          steps={concept.example.steps}
          revealedUntil={exampleLast}
          activeIndex={exampleLast}
        />

        <div className="concept-cols">
          <section>
            <h3>What happens</h3>
            <p>{concept.description}</p>
            <h3>Why it matters</h3>
            <p>{concept.whyItMatters}</p>
          </section>
          <section>
            <h3>Example payload</h3>
            {concept.example.steps
              .filter((s) => s.payload !== undefined)
              .map((s, i) => (
                <div key={i}>
                  <p className="muted small">{s.note}</p>
                  <Payload value={s.payload} />
                </div>
              ))}
          </section>
        </div>

        <section>
          <h3>In the playground</h3>
          {firstPerScenario.length === 0 ? (
            <p className="muted">Not in any scenario yet.</p>
          ) : (
            <div className="seen-in">
              {firstPerScenario.map(({ scenario, index }) => (
                <Link key={scenario.id} to={`/playground/${scenario.id}?step=${index + 1}`}>
                  {scenario.title} · step {index + 1} →
                </Link>
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  )
}
