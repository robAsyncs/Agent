const LADDER = [
  { title: 'Language', adds: 'Meaning encoded in a sequence of symbols' },
  { title: 'Language model', adds: 'A probability for the next word' },
  { title: 'LLM', adds: 'Transformers and scale: general ability' },
  { title: 'Chatbot', adds: 'Instruction tuning and a conversation format' },
  { title: 'Agent', adds: 'Tools and a loop: it can act' },
]

/** Each layer builds on the one before it. */
export function Ladder() {
  return (
    <ol className="ladder">
      {LADDER.map((step, i) => (
        <li key={step.title}>
          <span className="ladder-num">{i + 1}</span>
          <strong>{step.title}</strong>
          <span>{step.adds}</span>
        </li>
      ))}
    </ol>
  )
}

function Node({ x, y, title, sub }: { x: number; y: number; title: string; sub: string }) {
  return (
    <g>
      <rect x={x - 80} y={y - 27} width={160} height={54} rx={14} className="dg-node" />
      <text x={x} y={y - 4} className="dg-title">
        {title}
      </text>
      <text x={x} y={y + 14} className="dg-sub">
        {sub}
      </text>
    </g>
  )
}

/** Think → act → observe, entered with a task and exited with an answer. */
export function AgentLoop() {
  return (
    <svg className="diagram" viewBox="0 0 600 270" role="img" aria-labelledby="loop-title">
      <title id="loop-title">
        The agent loop: the model thinks, the harness acts, the result is observed, until the model answers.
      </title>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" className="dg-head" />
        </marker>
      </defs>

      <rect x={10} y={30} width={90} height={44} rx={22} className="dg-pill" />
      <text x={55} y={57} className="dg-title">
        Task
      </text>
      <rect x={500} y={30} width={90} height={44} rx={22} className="dg-pill" />
      <text x={545} y={57} className="dg-title">
        Answer
      </text>

      <path d="M102 52H216" className="dg-edge" markerEnd="url(#arrow)" />
      <path d="M384 52H498" className="dg-edge" markerEnd="url(#arrow)" />
      <text x={441} y={42} className="dg-label">
        done
      </text>

      <path d="M350 80Q420 120 430 186" className="dg-edge" markerEnd="url(#arrow)" />
      <text x={448} y={146} className="dg-label" textAnchor="start">
        tool_use
      </text>
      <path d="M348 218H252" className="dg-edge" markerEnd="url(#arrow)" />
      <text x={300} y={238} className="dg-label">
        tool_result
      </text>
      <path d="M170 186Q180 120 228 80" className="dg-edge" markerEnd="url(#arrow)" />
      <text x={150} y={120} className="dg-label" textAnchor="end">
        new context
      </text>

      <Node x={300} y={52} title="Think" sub="model picks next step" />
      <Node x={430} y={218} title="Act" sub="harness runs the tool" />
      <Node x={170} y={218} title="Observe" sub="result joins the context" />
    </svg>
  )
}
