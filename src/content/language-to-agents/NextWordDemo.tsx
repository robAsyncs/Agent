import { useMemo, useState } from 'react'

/** A tiny corpus. Sentences share words on purpose so the model has real choices to make. */
const CORPUS = `
the agent reads the task .
the agent calls a tool .
the agent calls the weather tool .
the model reads the context .
the model predicts the next word .
the model picks a tool .
the tool returns a result .
the result goes back to the model .
the model writes the answer .
the user reads the answer .
the user asks a question .
the agent answers the question .
the weather tool returns the forecast .
the forecast says rain .
the model reads the forecast .
the answer says bring an umbrella .
a tool runs code .
a model predicts words .
the next word depends on the last word .
`

const TOKENS = CORPUS.trim().split(/\s+/)
const SENTENCES = CORPUS.trim().split('\n').length

/** Bigram counts: for each word, how often each other word follows it. */
const BIGRAMS = (() => {
  const table = new Map<string, Map<string, number>>()
  for (let i = 0; i < TOKENS.length - 1; i++) {
    const row = table.get(TOKENS[i]) ?? new Map<string, number>()
    row.set(TOKENS[i + 1], (row.get(TOKENS[i + 1]) ?? 0) + 1)
    table.set(TOKENS[i], row)
  }
  return table
})()

const MAX_SHOWN = 6
const START = ['the']

export function NextWordDemo() {
  const [words, setWords] = useState(START)
  const [temperature, setTemperature] = useState(1)

  const last = words[words.length - 1]
  const candidates = useMemo(() => {
    const row = BIGRAMS.get(last) ?? new Map<string, number>()
    const total = [...row.values()].reduce((a, b) => a + b, 0)
    // Temperature reshapes the distribution: p ∝ count^(1/T).
    const weights = [...row].map(([word, count]) => ({ word, count, w: Math.pow(count, 1 / temperature) }))
    const z = weights.reduce((a, b) => a + b.w, 0)
    return {
      total,
      list: weights.map((c) => ({ ...c, p: c.w / z })).sort((a, b) => b.p - a.p),
    }
  }, [last, temperature])

  const append = (word: string) => setWords((prev) => [...prev, word].slice(-40))

  const sample = (n: number) => {
    let current = [...words]
    for (let i = 0; i < n; i++) {
      const row = BIGRAMS.get(current[current.length - 1])
      if (!row) break
      const options = [...row].map(([word, count]) => ({ word, w: Math.pow(count, 1 / temperature) }))
      let r = Math.random() * options.reduce((a, b) => a + b.w, 0)
      const pick = options.find((o) => (r -= o.w) <= 0) ?? options[options.length - 1]
      current = [...current, pick.word].slice(-40)
    }
    setWords(current)
  }

  return (
    <div className="demo">
      <p className="demo-output" aria-live="polite">
        {words.map((w, i) => (
          <span key={i} className={i === words.length - 1 ? 'last' : ''}>
            {w}{' '}
          </span>
        ))}
      </p>

      <div className="demo-head">
        <span>
          P(next | <code>{last}</code>), from {candidates.total} occurrences
        </span>
      </div>
      <ul className="bars">
        {candidates.list.slice(0, MAX_SHOWN).map((c) => (
          <li key={c.word}>
            <button type="button" onClick={() => append(c.word)} title={`Append “${c.word}”`}>
              <code className="bar-word">{c.word}</code>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${c.p * 100}%` }} />
              </span>
              <span className="bar-value">
                {(c.p * 100).toFixed(0)}% <span className="muted">({c.count})</span>
              </span>
            </button>
          </li>
        ))}
        {candidates.list.length > MAX_SHOWN && (
          <li className="muted small">+{candidates.list.length - MAX_SHOWN} more</li>
        )}
      </ul>

      <div className="demo-controls">
        <button type="button" className="pill primary" onClick={() => sample(1)}>
          Sample 1
        </button>
        <button type="button" className="pill" onClick={() => sample(10)}>
          Sample 10
        </button>
        <button type="button" className="pill" onClick={() => setWords(START)}>
          Reset
        </button>
        <label className="slider">
          Temperature <output>{temperature.toFixed(1)}</output>
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </label>
      </div>
      <p className="demo-note">
        A bigram model trained in your browser on {SENTENCES} sentences ({TOKENS.length} tokens). Click a word to
        append it, or sample from the distribution.
      </p>
    </div>
  )
}
