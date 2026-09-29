import type { Step } from '../types'

/** Illustrative limit, kept small so growth is visible in these short demos. */
const LIMIT = 400

export function ContextWindow({ steps, revealedUntil }: { steps: Step[]; revealedUntil: number }) {
  const entries = steps.slice(0, revealedUntil + 1).flatMap((s) => (s.context ? [s.context] : []))
  const used = entries.reduce((sum, e) => sum + e.tokens, 0)
  const pct = Math.min(100, (used / LIMIT) * 100)

  return (
    <section className="panel context">
      <div className="context-head">
        <h3>Context window</h3>
        <span className="muted small">
          ~{used} / {LIMIT} tokens
        </span>
      </div>
      <div className="meter" aria-hidden="true">
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted small">
        What the model sees on its next call. All of it is re-sent every time. (Demo scale: real
        models allow 200k+ tokens.)
      </p>
      {entries.length === 0 ? (
        <p className="muted small">Empty</p>
      ) : (
        <ol className="context-list">
          {entries.map((e, i) => (
            <li key={i} className={`ctx ctx-${e.role}`}>
              <span className="ctx-role">{e.role}</span>
              <span className="ctx-summary">{e.summary}</span>
              <span className="ctx-tokens">{e.tokens}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
