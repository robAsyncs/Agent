import { Code } from '../llm-apis/Code'

const FLOW: { who: string; title: string; body: string; kind: 'app' | 'model' }[] = [
  { who: 'Your code', title: 'Sends the question', body: 'messages + a list of tool definitions', kind: 'app' },
  { who: 'Model', title: 'Asks for a tool', body: 'a tool_use block: name and JSON input', kind: 'model' },
  { who: 'Your code', title: 'Runs the function', body: 'then sends a tool_result back', kind: 'app' },
  { who: 'Model', title: 'Answers', body: 'with the result in its context', kind: 'model' },
]

/** The four beats of one tool call. */
export function ToolFlow() {
  return (
    <ol className="tu-flow">
      {FLOW.map((s, i) => (
        <li key={i} className={`tu-flow-step tu-flow-${s.kind}`}>
          <span className="tu-flow-num">{i + 1}</span>
          <span className="tu-flow-who">{s.who}</span>
          <strong>{s.title}</strong>
          <span className="tu-flow-body">{s.body}</span>
        </li>
      ))}
    </ol>
  )
}

type Side = { label: string; code: string; lang?: 'json' | 'text'; note: string }

/** Two versions of the same thing, side by side: what to avoid and what to do instead. */
export function BeforeAfter({ before, after }: { before: Side; after: Side }) {
  return (
    <div className="tu-ba">
      {[before, after].map((s, i) => (
        <div key={s.label} className={`tu-ba-col ${i === 0 ? 'bad' : 'good'}`}>
          <span className="api-pane-label">{s.label}</span>
          <Code lang={s.lang ?? 'json'} code={s.code} />
          <p className="tu-ba-note">{s.note}</p>
        </div>
      ))}
    </div>
  )
}
