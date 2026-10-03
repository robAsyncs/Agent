import { useEffect, useState } from 'react'
import { Explorer } from './components/Explorer'
import { FullRun } from './components/FullRun'
import { Home } from './components/Home'
import { SCENARIOS } from './data/scenarios'
import type { ActionKind } from './types'

type Page = 'home' | 'run' | 'explore'

/** The page lives in the URL hash (#/run, #/explore) so the back button works. */
function pageFromHash(): Page {
  const page = window.location.hash.replace(/^#\/?/, '')
  return page === 'run' || page === 'explore' ? page : 'home'
}

function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [startAt, setStartAt] = useState(-1)
  const [concept, setConcept] = useState<ActionKind>('system_prompt')

  useEffect(() => {
    const onHash = () => {
      // In-page anchors on the home page (#overview) are not routes.
      if (!window.location.hash.startsWith('#/') && window.location.hash !== '') return
      setPage(pageFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (next: Page) => {
    window.location.hash = next === 'home' ? '/' : `/${next}`
  }

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]

  const learnMore = (kind: ActionKind) => {
    setConcept(kind)
    go('explore')
  }

  const openInRun = (id: string, index: number) => {
    setScenarioId(id)
    setStartAt(index)
    go('run')
  }

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a className="wordmark" href="#/">
            Agent Anatomy
          </a>
          <nav className="mode-switch" aria-label="Pages">
            <a
              href="#/run"
              className={page === 'run' ? 'on' : ''}
              aria-current={page === 'run' ? 'page' : undefined}
            >
              Full run
            </a>
            <a
              href="#/explore"
              className={page === 'explore' ? 'on' : ''}
              aria-current={page === 'explore' ? 'page' : undefined}
            >
              Explore actions
            </a>
          </nav>
        </div>
      </header>

      {page === 'home' ? (
        <Home
          onOpenRun={(id) => {
            if (id) setScenarioId(id)
            setStartAt(-1)
            go('run')
          }}
          onOpenExplore={() => go('explore')}
        />
      ) : (
        <main className="app">
          {page === 'run' ? (
            <>
              <header className="page-head">
                <h1>Full run</h1>
                <p>
                  Pick a scenario and press play. Each message between the user, agent, model,
                  tools and memory appears on the timeline. Click any step to see its raw data.
                </p>
              </header>
              <FullRun
                scenarios={SCENARIOS}
                scenario={scenario}
                startAt={startAt}
                onScenarioChange={(id) => {
                  setScenarioId(id)
                  setStartAt(-1)
                }}
                onLearnMore={learnMore}
              />
            </>
          ) : (
            <>
              <header className="page-head">
                <h1>Explore actions</h1>
                <p>
                  The building blocks behind every agent, each one with a small example and the
                  actual data being exchanged.
                </p>
              </header>
              <Explorer selected={concept} onSelect={setConcept} onOpenInRun={openInRun} />
            </>
          )}
        </main>
      )}
    </>
  )
}

export default App
