import { TopicList } from '../components/TopicList'
import { GROUPS, topicsIn } from '../data/topics'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Topics() {
  useDocumentTitle('Topics')

  return (
    <main className="app">
      <header className="page-head">
        <h1>Topics</h1>
      </header>
      {GROUPS.map((group) => (
        <section key={group.id} className="phase">
          <h2 className="phase-title">{group.title}</h2>
          <TopicList topics={topicsIn(group.id)} showSummary />
        </section>
      ))}
    </main>
  )
}
