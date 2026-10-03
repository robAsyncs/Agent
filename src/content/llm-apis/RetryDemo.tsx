import { useState } from 'react'
import { Code } from './Code'

const MODEL = `
class Ticket(BaseModel):
    order_id: int
    urgency: Literal["low", "normal", "high"]
    action: str
`

type Step = { who: string; kind: 'model' | 'app' | 'error' | 'ok'; title: string; body: string; lang?: 'json' | 'text' }

const STEPS: Step[] = [
  {
    who: 'Model',
    kind: 'model',
    title: 'Attempt 1: reply',
    lang: 'json',
    body: '{"order_id": 4471, "urgency": "urgent", "action": "Check carrier status"}',
  },
  {
    who: 'App',
    kind: 'error',
    title: 'Ticket.model_validate_json(reply) raises',
    body: `1 validation error for Ticket
urgency
  Input should be 'low', 'normal' or 'high' [type=literal_error, input_value='urgent', input_type=str]`,
  },
  {
    who: 'App',
    kind: 'app',
    title: 'Sends the error back as a new user message',
    body: `Your JSON failed validation:
<error>
urgency: Input should be 'low', 'normal' or 'high'
</error>
Reply with corrected JSON only.`,
  },
  {
    who: 'Model',
    kind: 'model',
    title: 'Attempt 2: reply',
    lang: 'json',
    body: '{"order_id": 4471, "urgency": "high", "action": "Check carrier status"}',
  },
  {
    who: 'App',
    kind: 'ok',
    title: 'Validation passes',
    body: "Ticket(order_id=4471, urgency='high', action='Check carrier status')",
  },
]

export function RetryDemo() {
  const [shown, setShown] = useState(0)
  const done = shown === STEPS.length

  return (
    <div className="demo api-retry">
      <Code title="The schema the app expects" lang="python" code={MODEL} />
      <ol className="api-steps">
        {STEPS.slice(0, shown).map((s, i) => (
          <li key={i} className={`api-step api-step-${s.kind}`}>
            <span className="api-step-who">
              {s.who} · {s.title}
            </span>
            {s.lang === 'json' ? <Code lang="json" code={s.body} /> : <pre className="api-step-body">{s.body}</pre>}
          </li>
        ))}
      </ol>
      <div className="demo-controls">
        <button type="button" className="pill primary" onClick={() => setShown(done ? 0 : shown + 1)}>
          {done ? 'Replay' : shown === 0 ? 'Send request' : 'Next step'}
        </button>
        <span className="small muted">
          Step {shown} of {STEPS.length}
        </span>
      </div>
      <p className="demo-note">
        The model replies are illustrative; the validation error is Pydantic v2&apos;s real message format. Cap the
        loop at two or three attempts and fail loudly after that.
      </p>
    </div>
  )
}
