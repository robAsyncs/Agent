import { useEffect } from 'react'
import { usePlayback } from '../hooks/usePlayback'
import type { Scenario } from '../types'
import { ContextWindow } from './ContextWindow'
import { PlaybackControls } from './PlaybackControls'
import { StepDetail } from './StepDetail'
import { Timeline } from './Timeline'

interface Props {
  scenarios: Scenario[]
  scenario: Scenario
  startAt: number
  onScenarioChange: (id: string) => void
}

export function FullRun({ scenarios, scenario, startAt, onScenarioChange }: Props) {
  const pb = usePlayback(scenario.steps.length)
  const { jumpTo, next, prev, togglePlay } = pb

  useEffect(() => {
    jumpTo(startAt)
  }, [scenario.id, startAt, jumpTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      } else return
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, togglePlay])

  return (
    <div className="full-run">
      <div className="scenario-bar">
        <div className="scenario-switch" role="tablist" aria-label="Scenario">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === scenario.id}
              className={s.id === scenario.id ? 'on' : ''}
              onClick={() => onScenarioChange(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
        <p className="scenario-tagline">{scenario.tagline}</p>
      </div>

      <div className="run-grid">
        <div className="run-main">
          <PlaybackControls pb={pb} total={scenario.steps.length} />
          <Timeline
            steps={scenario.steps}
            revealedUntil={pb.index}
            activeIndex={pb.index}
            onSelect={pb.jumpTo}
          />
        </div>
        <aside className="run-side">
          <StepDetail
            step={scenario.steps[pb.index]}
            index={pb.index}
            total={scenario.steps.length}
          />
          <ContextWindow steps={scenario.steps} revealedUntil={pb.index} />
        </aside>
      </div>
    </div>
  )
}
