import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { FullRun } from '../components/FullRun'
import { SCENARIOS } from '../data/scenarios'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function Playground() {
  const { scenarioId } = useParams()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)
  useDocumentTitle(scenario ? `${scenario.title} · Playground` : 'Playground')

  if (!scenario) return <Navigate to={`/playground/${SCENARIOS[0].id}`} replace />

  // ?step is 1-based in the URL; the player is 0-based with -1 meaning "not started".
  const step = Number(search.get('step'))
  const startAt = Number.isInteger(step) && step >= 1 && step <= scenario.steps.length ? step - 1 : -1

  return (
    <main className="app playground">
      <h1 className="sr-only">Playground</h1>
      <FullRun
        scenarios={SCENARIOS}
        scenario={scenario}
        startAt={startAt}
        onScenarioChange={(id) => navigate(`/playground/${id}`)}
      />
    </main>
  )
}
