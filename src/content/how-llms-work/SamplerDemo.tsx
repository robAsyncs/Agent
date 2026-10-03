import { useMemo, useState } from 'react'

const PROMPT = 'The best thing about a rainy Sunday is the'

/** Illustrative logits (raw scores) for the next token. */
const LOGITS: [string, number][] = [
  [' coffee', 3.2],
  [' quiet', 2.6],
  [' books', 2.3],
  [' sound', 2.1],
  [' rest', 1.4],
  [' music', 1.1],
  [' soup', 0.6],
  [' traffic', 0.2],
]

const HISTORY = 10

/** softmax(logits / T), then keep the smallest set of tokens whose probability adds up to top_p. */
function distribution(temperature: number, topP: number) {
  const scaled = LOGITS.map(([t, z]) => ({ token: t, z: z / temperature }))
  const max = Math.max(...scaled.map((s) => s.z))
  const exp = scaled.map((s) => ({ ...s, e: Math.exp(s.z - max) }))
  const sum = exp.reduce((a, b) => a + b.e, 0)
  const probs = exp.map((s) => ({ token: s.token, p: s.e / sum })).sort((a, b) => b.p - a.p)

  let cumulative = 0
  const kept = new Set<string>()
  for (const { token, p } of probs) {
    if (cumulative >= topP) break
    kept.add(token)
    cumulative += p
  }
  const keptSum = probs.filter((x) => kept.has(x.token)).reduce((a, b) => a + b.p, 0)
  return probs.map((x) => ({ ...x, kept: kept.has(x.token), final: kept.has(x.token) ? x.p / keptSum : 0 }))
}

export function SamplerDemo() {
  const [temperature, setTemperature] = useState(1)
  const [topP, setTopP] = useState(1)
  const [samples, setSamples] = useState<string[]>([])
  const dist = useMemo(() => distribution(temperature, topP), [temperature, topP])

  const sample = (n: number) => {
    const picks: string[] = []
    for (let i = 0; i < n; i++) {
      let r = Math.random()
      picks.push((dist.find((d) => d.kept && (r -= d.final) <= 0) ?? dist[0]).token)
    }
    setSamples((prev) => [...picks.reverse(), ...prev].slice(0, HISTORY))
  }

  return (
    <div className="demo">
      <p className="llm-prompt">
        {PROMPT}
        <span className="llm-blank">___</span>
      </p>

      <ul className="bars">
        {dist.map((d) => (
          <li key={d.token} className={d.kept ? '' : 'llm-cut'}>
            <div className="llm-bar-row">
              <code className="bar-word">{d.token.trim()}</code>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${d.final * 100}%` }} />
                {!d.kept && <span className="llm-ghost" style={{ width: `${d.p * 100}%` }} />}
              </span>
              <span className="bar-value">{d.kept ? `${(d.final * 100).toFixed(0)}%` : 'cut'}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="demo-controls">
        <label className="slider llm-slider">
          Temperature <output>{temperature.toFixed(2)}</output>
          <input
            type="range"
            min={0.05}
            max={2}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </label>
        <label className="slider llm-slider">
          Top-p <output>{topP.toFixed(2)}</output>
          <input type="range" min={0.1} max={1} step={0.05} value={topP} onChange={(e) => setTopP(Number(e.target.value))} />
        </label>
      </div>

      <div className="demo-controls llm-sample-row">
        <button type="button" className="pill primary" onClick={() => sample(1)}>
          Sample
        </button>
        <button type="button" className="pill" onClick={() => sample(5)}>
          Sample 5
        </button>
        <span className="llm-samples" aria-live="polite">
          {samples.length === 0 ? (
            <span className="muted small">No samples yet</span>
          ) : (
            samples.map((s, i) => (
              <span key={samples.length - i + s} className={`llm-sample ${i === 0 ? 'new' : ''}`}>
                {s.trim()}
              </span>
            ))
          )}
        </span>
      </div>
      <p className="demo-note">
        The logits are illustrative. Low temperature sharpens the distribution toward the top token; high
        temperature flattens it. Top-p then drops the unlikely tail and renormalizes what is left.
      </p>
    </div>
  )
}
