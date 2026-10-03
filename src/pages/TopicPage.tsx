import { Fragment } from 'react'
import { Link, useParams } from 'react-router'
import { CONCEPT_BY_KIND } from '../data/concepts'
import { SCENARIOS } from '../data/scenarios'
import { GROUPS, TOPIC_BY_ID, TOPICS } from '../data/topics'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { Section, Topic } from '../types'
import { NotFound } from './NotFound'

const label = (t: Topic) => (t.number === null ? 'Final project' : `Topic ${t.number}`)

/** Renders `code` spans in outline text. */
function Text({ children }: { children: string }) {
  return children
    .split('`')
    .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>))
}

function Outline({ sections }: { sections: Section[] }) {
  return sections.map((section, i) => (
    <section key={section.title} className="topic">
      <h2>
        <span className="topic-num">{i + 1}</span>
        <Text>{section.title}</Text>
      </h2>
      {section.body && <p>{section.body}</p>}
      <ul>
        {section.points.map((point) => (
          <li key={point}>
            <Text>{point}</Text>
          </li>
        ))}
      </ul>
    </section>
  ))
}

export function TopicPage() {
  const { topicId = '' } = useParams()
  const topic = TOPIC_BY_ID[topicId]
  useDocumentTitle(topic?.title ?? 'Page not found')

  if (!topic) return <NotFound />

  const index = TOPICS.indexOf(topic)
  const prev = TOPICS[index - 1]
  const next = TOPICS[index + 1]
  const group = GROUPS.find((g) => g.id === topic.group)
  const scenarios = SCENARIOS.filter((s) => topic.scenarios?.includes(s.id))

  return (
    <main className="app">
      <article className="module">
        <header className="page-head module-head">
          <Link className="crumb" to="/topics">
            ← Topics
          </Link>
          <span className="module-meta">
            {label(topic)} · {group?.title}
          </span>
          <h1>{topic.title}</h1>
          <p>{topic.summary}</p>
        </header>

        <div className="module-body">
          {topic.article ? <topic.article /> : <Outline sections={topic.sections} />}

          {(scenarios.length > 0 || topic.concepts) && (
            <section className="topic">
              <h2>Interactive</h2>
              {scenarios.length > 0 && (
                <div className="try-grid">
                  {scenarios.map((s) => (
                    <Link key={s.id} className="try-card" to={`/playground/${s.id}`}>
                      <strong>{s.title}</strong>
                      <span>{s.tagline}</span>
                      <span className="try-go">Open in Playground →</span>
                    </Link>
                  ))}
                </div>
              )}
              {topic.concepts && (
                <div className="seen-in">
                  {topic.concepts.map((kind) => (
                    <Link key={kind} to={`/reference/${kind}`}>
                      {CONCEPT_BY_KIND[kind].title}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          {topic.project && (
            <section className="milestone">
              <span className="tile-eyebrow">What I built</span>
              <p>{topic.project}</p>
            </section>
          )}

          {topic.sources.length > 0 && (
            <section className="topic">
              <h2>Sources</h2>
              <ul>
                {topic.sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          <nav className="pager" aria-label="Topics">
            {prev ? (
              <Link to={`/topics/${prev.id}`}>
                <span>← {label(prev)}</span>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/topics/${next.id}`} className="pager-next">
                <span>{label(next)} →</span>
                <strong>{next.title}</strong>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </main>
  )
}
