import { useState } from 'react'

const QUESTION = 'Should I bring an umbrella in Addis Ababa this afternoon?'

const CHATBOT_REPLY =
  "I can't check live weather. Addis Ababa's main rainy season runs from June to September, so if you're there during those months, an umbrella is a good idea."

const AGENT_STEPS = [
  { who: 'Model', kind: 'tool_use', text: 'get_weather({ "city": "Addis Ababa" })' },
  { who: 'Harness', kind: 'tool_result', text: '{ "temp_c": 18, "rain_chance": 0.7, "rain_window": "15:00–18:00" }' },
  { who: 'Model', kind: 'answer', text: 'Yes. There is a 70% chance of rain between 3 and 6 pm, so bring an umbrella.' },
]

export function ChatVsAgentDemo() {
  const [shown, setShown] = useState(0)
  const done = shown === AGENT_STEPS.length
  const modelCalls = AGENT_STEPS.slice(0, shown).filter((s) => s.who === 'Model').length

  return (
    <div className="demo">
      <div className="versus">
        <div className="versus-col">
          <h4>Chatbot</h4>
          <span className="small muted">1 model call, no tools</span>
          <div className="msg user">{QUESTION}</div>
          <div className="msg assistant">{CHATBOT_REPLY}</div>
        </div>
        <div className="versus-col">
          <h4>Agent</h4>
          <span className="small muted">
            {modelCalls} model call{modelCalls === 1 ? '' : 's'}, tool: <code>get_weather</code>
          </span>
          <div className="msg user">{QUESTION}</div>
          {AGENT_STEPS.slice(0, shown).map((s, i) => (
            <div key={i} className={`msg ${s.kind === 'answer' ? 'assistant' : 'trace'}`}>
              {s.kind !== 'answer' && (
                <span className="msg-label">
                  {s.who} · {s.kind}
                </span>
              )}
              {s.kind === 'answer' ? s.text : <code>{s.text}</code>}
            </div>
          ))}
        </div>
      </div>
      <div className="demo-controls">
        <button
          type="button"
          className="pill primary"
          onClick={() => setShown(done ? 0 : shown + 1)}
        >
          {done ? 'Replay' : 'Next agent step'}
        </button>
        <span className="small muted">
          Step {shown} of {AGENT_STEPS.length}
        </span>
      </div>
    </div>
  )
}
