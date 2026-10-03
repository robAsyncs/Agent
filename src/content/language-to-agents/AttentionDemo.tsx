import { useState, type CSSProperties } from 'react'

const PREFIX = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too']
const FOCUS = PREFIX.indexOf('it')

/** Illustrative attention from "it" to every token. Each row sums to 1. */
const ENDINGS = {
  tired: [0.03, 0.55, 0.04, 0.05, 0.02, 0.08, 0.03, 0.06, 0.04, 0.03, 0.07],
  wide: [0.03, 0.09, 0.03, 0.05, 0.04, 0.52, 0.03, 0.06, 0.04, 0.01, 0.1],
}

type Ending = keyof typeof ENDINGS

export function AttentionDemo() {
  const [ending, setEnding] = useState<Ending>('tired')
  const tokens = [...PREFIX, ending]
  const weights = ENDINGS[ending]

  return (
    <div className="demo">
      <div className="demo-controls">
        <span className="small muted">Last word:</span>
        <div className="speed" role="group" aria-label="Last word">
          {(Object.keys(ENDINGS) as Ending[]).map((e) => (
            <button key={e} type="button" className={ending === e ? 'on' : ''} onClick={() => setEnding(e)}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <p className="attn">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={`attn-token ${i === FOCUS ? 'focus' : ''}`}
            style={{ '--w': weights[i] } as CSSProperties}
          >
            <span className="attn-word">{t}</span>
            <span className="attn-weight">{weights[i].toFixed(2)}</span>
          </span>
        ))}
      </p>
      <p className="demo-note">
        How strongly <code>it</code> attends to each token. Weights are illustrative, not read from a real model.
      </p>
    </div>
  )
}
