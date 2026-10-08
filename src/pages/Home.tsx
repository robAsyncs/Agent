import { Link } from 'react-router'
import { HarnessDiagram } from '../components/HarnessDiagram'
import { TopicList } from '../components/TopicList'
import { GROUPS, topicsIn } from '../data/topics'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Home() {
  useDocumentTitle()

  return (
    <div className="home">
      <section className="home-hero">
        <HarnessDiagram />
        <h1>Under the Harness</h1>
        <p>A semester project on how AI agents work.</p>
        <a className="scroll-cue" href="#topics" aria-label="Scroll to topics">
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

      <section id="topics" className="home-section">
        <div className="section-head">
          <h2>Topics</h2>
          <Link className="cta" to="/topics">
            View all
          </Link>
        </div>
        {GROUPS.map((group) => (
          <div key={group.id} className="phase">
            <h3 className="phase-title">{group.title}</h3>
            <TopicList topics={topicsIn(group.id)} />
          </div>
        ))}
      </section>

      <section className="home-section">
        <div className="tiles">
          <Link className="tile" to="/playground">
            <span className="tile-eyebrow">Playground</span>
            <h3>Watch an agent run, step by step.</h3>
          </Link>
          <Link className="tile" to="/reference">
            <span className="tile-eyebrow">Reference</span>
            <h3>Every agent action, with examples.</h3>
          </Link>
        </div>
      </section>
    </div>
  )
}
