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
