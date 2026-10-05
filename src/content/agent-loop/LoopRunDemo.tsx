import { useState } from 'react'

const TASK = 'How many times more people live in Brasília than in Reykjavík?'

/** Tokens in the first request: system prompt, two tool definitions and the task. */
const BASE_TOKENS = 900

type Iteration = { think: string; act?: string; observe?: string; answer?: string; added: number }

/** One entry per model call. `added` is what the call and its tool result add to the history. */
const RUN: Iteration[] = [
  {
    think: 'I need both populations. Start with Brasília.',
    act: 'web_search("Brasília population census")',
    observe: '“Brasília … has a population of about 2.8 million (2022 census).” (+ 4 more results)',
    added: 1400,
  },
  {
    think: 'Got Brasília. Now Reykjavík.',
    act: 'web_search("Reykjavík population")',
    observe: '“Reykjavík has a population of around 140,000.” (+ 4 more results)',
    added: 1400,
  },
  {
    think: 'Divide them with the calculator rather than in my head.',
    act: 'calculate("2800000 / 140000")',
    observe: '20.0',
    added: 120,
  },
  {
    think: 'I have both figures and the ratio, with sources.',
    answer: 'About 20 times as many: Brasília has roughly 2.8 million people and Reykjavík roughly 140,000.',
    added: 80,
  },
]

const inputTokens = (i: number) => BASE_TOKENS + RUN.slice(0, i).reduce((sum, it) => sum + it.added, 0)
const MAX_INPUT = inputTokens(RUN.length - 1)

export function LoopRunDemo() {
  const [limit, setLimit] = useState(6)
  const [shown, setShown] = useState(0)

  const stopped = shown >= limit && shown < RUN.length
  const finished = shown === RUN.length || stopped
  const billed = Array.from({ length: shown }, (_, i) => inputTokens(i)).reduce((a, b) => a + b, 0)

  return (
    <div className="demo agl-run">
      <div className="demo-controls agl-run-head">
        <div className="msg user">{TASK}</div>
        <label className="slider">
          max_iterations
          <input
            type="range"
            min={1}
            max={6}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value))
              setShown(0)
            }}
          />
          <output>{limit}</output>
        </label>
      </div>

      <ol className="agl-iters">
        {RUN.slice(0, shown).map((it, i) => (
          <li key={i} className="agl-iter">
            <div className="agl-iter-head">
              <span>Iteration {i + 1}</span>
              <span className="agl-meter" title={`${inputTokens(i).toLocaleString()} input tokens`}>
                <span style={{ width: `${(inputTokens(i) / MAX_INPUT) * 100}%` }} />
              </span>
              <span className="agl-tokens">{inputTokens(i).toLocaleString()} tokens in</span>
            </div>
            <p className="agl-line">
              <span className="agl-tag think">Think</span>
              {it.think}
            </p>
            {it.act && (
              <p className="agl-line">
                <span className="agl-tag act">Act</span>
                <code>{it.act}</code>
              </p>
            )}
            {it.observe && (
              <p className="agl-line">
                <span className="agl-tag observe">Observe</span>
                {it.observe}
              </p>
            )}
            {it.answer && <div className="msg assistant">{it.answer}</div>}
          </li>
        ))}
        {stopped && (
          <li className="agl-iter agl-stop">
            Harness: <code>max_iterations</code> ({limit}) reached before the model answered. The run stops and
            reports that it could not finish.
          </li>
        )}
      </ol>

      <div className="demo-controls">
        <button type="button" className="pill primary" onClick={() => setShown(finished ? 0 : shown + 1)}>
          {finished ? 'Replay' : shown === 0 ? 'Start the loop' : 'Next iteration'}
        </button>
        <span className="small muted">
          {shown} model call{shown === 1 ? '' : 's'} · {billed.toLocaleString()} input tokens billed in total
        </span>
      </div>
      <p className="demo-note">
        Set <code>max_iterations</code> below 4 to see the limit cut the run short. Every iteration resends the whole
        history, so the input grows with each call and the total billed grows faster still. Search results and
        token counts are illustrative.
      </p>
    </div>
  )
}
