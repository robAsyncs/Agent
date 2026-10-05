import { useState } from 'react'
import { Code } from '../llm-apis/Code'

type Step = { who: string; kind: 'app' | 'model' | 'ok'; title: string; body: string; lang: 'json' | 'python' }

const STEPS: Step[] = [
  {
    who: 'App',
    kind: 'app',
    title: 'Request 1: the question, plus the tools on offer',
    lang: 'json',
    body: `{
  "tools": [{"name": "get_weather", "description": "…", "input_schema": {…}}],
  "messages": [
    {"role": "user", "content": "Do I need a jacket in Cape Town tonight?"}
  ]
}`,
  },
  {
    who: 'Model',
    kind: 'model',
    title: 'Response 1: a tool request instead of an answer',
    lang: 'json',
    body: `{
  "content": [
    {"type": "text", "text": "Let me check tonight's forecast."},
    {"type": "tool_use", "id": "toolu_01A…", "name": "get_weather",
     "input": {"city": "Cape Town, ZA"}}
  ],
  "stop_reason": "tool_use"
}`,
  },
  {
    who: 'App',
    kind: 'app',
    title: 'Runs the real function with the model’s arguments',
    lang: 'python',
    body: `get_weather(city="Cape Town, ZA")
# → {"temp_c": 13, "wind_kph": 32, "condition": "clear"}`,
  },
  {
    who: 'App',
    kind: 'app',
    title: 'Request 2: the whole conversation, plus the result',
    lang: 'json',
    body: `"messages": [
  {"role": "user", "content": "Do I need a jacket in Cape Town tonight?"},
  {"role": "assistant", "content": [ …the text and tool_use blocks above… ]},
  {"role": "user", "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01A…",
     "content": "{\\"temp_c\\": 13, \\"wind_kph\\": 32, \\"condition\\": \\"clear\\"}"}
  ]}
]`,
  },
  {
    who: 'Model',
    kind: 'ok',
    title: 'Response 2: the answer',
    lang: 'json',
    body: `{
  "content": [{"type": "text", "text": "Yes. It will be 13 °C with a strong 32 km/h wind, so it will feel colder than that. Take a windproof jacket."}],
  "stop_reason": "end_turn"
}`,
  },
]

export function ToolCallDemo() {
  const [shown, setShown] = useState(0)
  const done = shown === STEPS.length
  const calls = STEPS.slice(0, shown).filter((s) => s.who === 'Model').length

  return (
    <div className="demo">
      <ol className="api-steps">
        {STEPS.slice(0, shown).map((s, i) => (
          <li key={i} className={`api-step api-step-${s.kind}`}>
            <span className="api-step-who">
              {s.who} · {s.title}
            </span>
            <Code lang={s.lang} code={s.body} />
          </li>
        ))}
      </ol>
      <div className="demo-controls">
        <button type="button" className="pill primary" onClick={() => setShown(done ? 0 : shown + 1)}>
          {done ? 'Replay' : shown === 0 ? 'Send request' : 'Next step'}
        </button>
        <span className="small muted">
          Step {shown} of {STEPS.length} · {calls} model call{calls === 1 ? '' : 's'}
        </span>
      </div>
      <p className="demo-note">
        Block shapes follow the Messages API; ids and weather values are illustrative, and the responses are abridged
        (no usage, and no thinking blocks). The model never runs <code>get_weather</code> itself. It only writes the
        request, and the result reaches it as text in the next call.
      </p>
    </div>
  )
}
