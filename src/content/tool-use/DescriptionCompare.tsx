import { useState } from 'react'
import { Code } from '../llm-apis/Code'

const QUESTION = 'Will it rain in Springfield this weekend?'

type Version = { tool: string; trace: { label: string; text: string; code?: boolean }[]; verdict: string }

const VERSIONS: Record<'vague' | 'detailed', Version> = {
  vague: {
    tool: `{
  "name": "weather",
  "description": "Gets weather.",
  "input_schema": {
    "type": "object",
    "properties": {"loc": {"type": "string"}}
  }
}`,
    trace: [
      { label: 'Model · tool_use', text: 'weather({"loc": "Springfield"})', code: true },
      { label: 'Tool · result', text: '{"loc": "Springfield, IL", "today": "sunny, 24 °C"}', code: true },
      { label: 'Model · answer', text: 'No rain expected: it’s sunny and 24 °C in Springfield.' },
    ],
    verdict:
      'Two silent mistakes. The tool picked one of many Springfields, and nothing said it only returns today, so the model answered a weekend question with today’s weather.',
  },
  detailed: {
    tool: `{
  "name": "get_forecast",
  "description": "Daily forecast (rain chance, high/low °C) for one city, up to 7 days ahead. Use it for any question about weather, temperature or rain. The city must be unambiguous: if the user's city could be in several places, ask which one before calling.",
  "input_schema": {
    "type": "object",
    "properties": {
      "city": {"type": "string",
               "description": "City, region and country, e.g. 'Springfield, Missouri, US'"},
      "days": {"type": "integer", "minimum": 1, "maximum": 7,
               "description": "How many days ahead, starting today"}
    },
    "required": ["city", "days"]
  }
}`,
    trace: [
      {
        label: 'Model · answer',
        text: 'There are several Springfields in the US. Which one do you mean: Illinois, Missouri, Massachusetts or somewhere else?',
      },
    ],
    verdict:
      'The description says when to use the tool and what it can’t do, and the parameter description shows the expected format. The model asks instead of guessing.',
  },
}

export function DescriptionCompare() {
  const [mode, setMode] = useState<'vague' | 'detailed'>('vague')
  const v = VERSIONS[mode]

  return (
    <div className="demo">
      <div className="demo-controls tu-controls">
        <div className="speed" role="group" aria-label="Tool definition">
          <button type="button" className={mode === 'vague' ? 'on' : ''} onClick={() => setMode('vague')}>
            Vague definition
          </button>
          <button type="button" className={mode === 'detailed' ? 'on' : ''} onClick={() => setMode('detailed')}>
            Detailed definition
          </button>
        </div>
      </div>
      <div className="tu-desc-cols" key={mode}>
        <div className="tu-desc-tool">
          <span className="api-pane-label">Tool definition</span>
          <Code lang="json" code={v.tool} />
        </div>
        <div className="versus-col">
          <span className="api-pane-label">What happens (illustrative)</span>
          <div className="msg user">{QUESTION}</div>
          {v.trace.map((t, i) => (
            <div key={i} className={`msg ${t.code ? 'trace' : 'assistant'}`}>
              {t.code && <span className="msg-label">{t.label}</span>}
              {t.code ? <code>{t.text}</code> : t.text}
            </div>
          ))}
          <p className="tu-verdict">{v.verdict}</p>
        </div>
      </div>
    </div>
  )
}
