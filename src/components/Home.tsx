import { CONCEPTS } from '../data/concepts'
import { CATEGORIES, LANES } from '../data/meta'
import { SCENARIOS } from '../data/scenarios'
import type { Category } from '../types'

const GROUPS: Category[] = ['core', 'planning', 'memory']

interface Props {
  onOpenRun: (scenarioId?: string) => void
  onOpenExplore: () => void
}

export function Home({ onOpenRun, onOpenExplore }: Props) {
  return (
    <div className="home">
      <section className="home-hero">
        <h1>Agent Anatomy</h1>
        <p>See what an AI agent actually does, step by step.</p>
        <a className="scroll-cue" href="#overview" aria-label="Scroll to overview">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      <section id="overview" className="home-section">
        <h2>Five parts, one loop.</h2>
        <p className="home-lead">
          Every agent is the same handful of pieces passing messages back and forth. This site draws
          those messages as they happen.
        </p>
        <ol className="lanes-summary">
          {LANES.map((lane) => (
            <li key={lane.id}>
              <strong>{lane.label}</strong>
              <span>{lane.hint}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section">
        <div className="tiles">
          <article className="tile">
            <span className="tile-eyebrow">Full run</span>
            <h3>Watch an agent work.</h3>
            <p>
              Play a complete run like a debugger. Every message appears on a timeline, with the raw
              payload and a live view of the context window.
            </p>
            <ul className="tile-list">
              {SCENARIOS.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => onOpenRun(s.id)}>
                    <strong>{s.title}</strong>
                    <span>{s.tagline}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="cta" onClick={() => onOpenRun()}>
              Start a run
            </button>
          </article>

          <article className="tile">
            <span className="tile-eyebrow">Explore actions</span>
            <h3>Learn each move.</h3>
            <p>
              {CONCEPTS.length} actions an agent can take, each explained on its own with a small
              example and the data it sends.
            </p>
            <ul className="tile-list">
              {GROUPS.map((cat) => (
                <li key={cat} className={`cat-${cat}`}>
                  <div>
                    <strong className="badge">{CATEGORIES[cat].label}</strong>
                    <span>{CATEGORIES[cat].blurb}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" className="cta" onClick={onOpenExplore}>
              Explore actions
            </button>
          </article>
        </div>
      </section>
    </div>
  )
}
