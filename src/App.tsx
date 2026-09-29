import { useState } from 'react'
import { Explorer } from './components/Explorer'
import { FullRun } from './components/FullRun'
import { SCENARIOS } from './data/scenarios'
import type { ActionKind } from './types'

type Mode = 'run' | 'explore'

function App() {
  const [mode, setMode] = useState<Mode>('run')
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [startAt, setStartAt] = useState(-1)
  const [concept, setConcept] = useState<ActionKind>('system_prompt')

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]

  const learnMore = (kind: ActionKind) => {
    setConcept(kind)
    setMode('explore')
  }

  const openInRun = (id: string, index: number) => {
    setScenarioId(id)
    setStartAt(index)
    setMode('run')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Agent Anatomy</h1>
          <p className="muted">See what an AI agent actually does, step by step.</p>
        </div>
        <div className="mode-switch" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'run'}
            className={mode === 'run' ? 'on' : ''}
            onClick={() => setMode('run')}
          >
            Full run
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'explore'}
            className={mode === 'explore' ? 'on' : ''}
            onClick={() => setMode('explore')}
          >
            Explore actions
          </button>
        </div>
      </header>

      <main>
        {mode === 'run' ? (
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
        ) : (
          <Explorer selected={concept} onSelect={setConcept} onOpenInRun={openInRun} />
        )}
      </main>
    </div>
  )
}

export default App
