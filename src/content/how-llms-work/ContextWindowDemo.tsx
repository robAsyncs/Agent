import { useState } from 'react'

const LIMIT = 120

interface Msg {
  id: number
  role: 'system' | 'user' | 'assistant' | 'summary'
  text: string
  tokens: number
  /** What a summary keeps from this message. */
  fact?: string
}

const SYSTEM: Msg = { id: 0, role: 'system', text: 'You are a trip-planning assistant.', tokens: 12 }

/** A scripted conversation. Each click adds the next user message and the reply. */
const SCRIPT: Omit<Msg, 'id'>[] = [
  { role: 'user', text: 'I want to visit Japan in November.', tokens: 10, fact: 'November trip' },
  { role: 'assistant', text: 'November is autumn-leaf season, a great time…', tokens: 24 },
  { role: 'user', text: 'I care most about food and temples.', tokens: 10, fact: 'food and temples' },
  { role: 'assistant', text: 'Then plan for Kyoto, Nara and a food tour in Osaka…', tokens: 28 },
  { role: 'user', text: 'My budget is about $2,000 for ten days.', tokens: 12, fact: '$2,000 budget' },
  { role: 'assistant', text: 'That works with domestic flights between the sites…', tokens: 26 },
  { role: 'user', text: 'Can you add a day trip from Tokyo?', tokens: 12, fact: 'day trip from Tokyo' },
  { role: 'assistant', text: 'Nikko is about two hours away, with shrines and waterfalls. Here is a full itinerary for the day…', tokens: 40 },
  { role: 'user', text: 'What did I say my budget was?', tokens: 9 },
  { role: 'assistant', text: 'You said about $2,000 for ten days.', tokens: 11 },
]

const FORGOT_REPLY = "I don't see a budget in our conversation. What is it?"
const BUDGET_ID = 5

type Strategy = 'reject' | 'drop' | 'summarize'

const STRATEGIES: { id: Strategy; label: string }[] = [
  { id: 'reject', label: 'Reject' },
  { id: 'drop', label: 'Drop oldest' },
  { id: 'summarize', label: 'Summarize' },
]

const total = (msgs: { tokens: number }[]) => msgs.reduce((a, m) => a + m.tokens, 0)

export function ContextWindowDemo() {
  const [strategy, setStrategy] = useState<Strategy>('drop')
  const [window, setWindow] = useState<Msg[]>([SYSTEM])
  const [forgotten, setForgotten] = useState<Msg[]>([])
  const [next, setNext] = useState(0)
  const [error, setError] = useState(false)

  const reset = (s = strategy) => {
    setStrategy(s)
    setWindow([SYSTEM])
    setForgotten([])
    setNext(0)
    setError(false)
  }

  const addTurn = () => {
    const turn = SCRIPT.slice(next, next + 2).map((m, i) => ({ ...m, id: next + i + 1 }))
    let msgs = [...window, ...turn]

    if (total(msgs) > LIMIT) {
      if (strategy === 'reject') {
        setError(true)
        return
      }
      const dropped: Msg[] = []
      // The system prompt stays pinned; the oldest conversation messages go first.
      while (total(msgs) > LIMIT && msgs.length > 2) {
        const idx = msgs.findIndex((m) => m.role !== 'system' && m.role !== 'summary')
        dropped.push(msgs[idx])
        msgs = msgs.filter((_, i) => i !== idx)
        if (strategy === 'summarize') {
          const existing = msgs.find((m) => m.role === 'summary')
          const facts = [...forgotten, ...dropped].flatMap((m) => (m.fact ? [m.fact] : []))
          const summary: Msg = {
            id: -1,
            role: 'summary',
            text: `Earlier: ${facts.join(', ') || 'small talk'}`,
            tokens: 4 + facts.length * 3,
          }
          msgs = existing
            ? msgs.map((m) => (m.role === 'summary' ? summary : m))
            : [msgs[0], summary, ...msgs.slice(1)]
        }
      }
      setForgotten((f) => [...f, ...dropped])
    }

    // The model can only answer from what is still in the window.
    const remembers = msgs.some((m) => m.id === BUDGET_ID || (m.role === 'summary' && m.text.includes('budget')))
    msgs = msgs.map((m) => (m.id === SCRIPT.length && !remembers ? { ...m, text: FORGOT_REPLY } : m))
    setWindow(msgs)
    setNext(next + 2)
    setError(false)
  }

  const used = total(window)
  const done = next >= SCRIPT.length

  return (
    <div className="demo">
      <div className="demo-controls">
        <span className="small muted">When the window is full:</span>
        <div className="speed" role="group" aria-label="Overflow strategy">
          {STRATEGIES.map((s) => (
            <button key={s.id} type="button" className={strategy === s.id ? 'on' : ''} onClick={() => reset(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="llm-window">
        <div className="llm-window-head">
          <span>Context window</span>
          <span className={used > LIMIT * 0.85 ? 'llm-hot' : 'muted'}>
            {used} / {LIMIT} tokens
          </span>
        </div>
        <div className="meter" aria-hidden="true">
          <div className="meter-fill" style={{ width: `${Math.min(100, (used / LIMIT) * 100)}%` }} />
        </div>
        <ol className="llm-msgs">
          {window.map((m) => (
            <li key={`${m.id}-${m.tokens}`} className={`llm-msg llm-${m.role}`}>
              <span className="llm-role">{m.role}</span>
              <span className="llm-text">{m.text}</span>
              <span className="llm-count">{m.tokens}</span>
            </li>
          ))}
        </ol>
        {error && (
          <p className="llm-error" role="alert">
            400 · prompt is too long: {used + total(SCRIPT.slice(next, next + 2))} tokens &gt; {LIMIT} maximum
          </p>
        )}
      </div>

      {forgotten.length > 0 && (
        <div className="llm-forgotten">
          <span className="small muted">
            {strategy === 'summarize' ? 'Compressed into the summary:' : 'No longer visible to the model:'}
          </span>
          <ol>
            {forgotten.map((m) => (
              <li key={m.id}>{m.text}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="demo-controls llm-sample-row">
        <button type="button" className="pill primary" onClick={addTurn} disabled={done || error}>
          Add a turn
        </button>
        <button type="button" className="pill" onClick={() => reset()}>
          Reset
        </button>
        <span className="small muted">
          Turn {next / 2} of {SCRIPT.length / 2}
        </span>
      </div>
      <p className="demo-note">
        Token counts and the {LIMIT}-token limit are illustrative; real windows hold hundreds of thousands of
        tokens. Watch the last question: with <em>Drop oldest</em>, the budget is gone by the time the user asks
        about it.
      </p>
    </div>
  )
}
