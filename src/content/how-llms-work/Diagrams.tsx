const STAGES = [
  {
    name: 'Pretraining',
    data: 'Trillions of tokens of web pages, books and code',
    objective: 'Predict the next token',
    result: 'Base model: completes documents',
    share: 0.9,
  },
  {
    name: 'Supervised fine-tuning',
    data: 'Thousands to hundreds of thousands of written example conversations',
    objective: 'Imitate the ideal response',
    result: 'Follows instructions in a chat format',
    share: 0.05,
  },
  {
    name: 'Preference tuning',
    data: 'Pairs of responses ranked by people or by an AI using written principles',
    objective: 'Prefer the better response (RLHF, DPO, RLAIF)',
    result: 'Chat model: helpful, honest, harmless style',
    share: 0.05,
  },
]

/** The three training stages behind a chat model. */
export function TrainingPipeline() {
  return (
    <div className="llm-pipeline">
      {STAGES.map((s, i) => (
        <div key={s.name} className="llm-stage">
          <span className="llm-stage-num">{i + 1}</span>
          <strong>{s.name}</strong>
          <dl>
            <dt>Data</dt>
            <dd>{s.data}</dd>
            <dt>Objective</dt>
            <dd>{s.objective}</dd>
            <dt>Result</dt>
            <dd>{s.result}</dd>
          </dl>
          <div className="llm-share" aria-label={i === 0 ? 'Most of the compute' : 'A small share of the compute'}>
            <span style={{ width: `${s.share * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

const ROWS: [string, string, string][] = [
  ['Access', 'Download the weights and run them yourself', 'Call the provider’s API'],
  ['Infrastructure', 'You host and serve it (GPUs, scaling, updates)', 'None: the provider runs it'],
  ['Data', 'Never leaves your machines', 'Sent to the provider under their terms'],
  ['Customization', 'Full fine-tuning and inspection', 'Prompting, and fine-tuning where offered'],
  ['Capability', 'Strong, usually a step behind the frontier', 'Usually where the frontier models are'],
  ['Change over time', 'Fixed until you choose to upgrade', 'Versions are updated and retired'],
]

/** Open-weight versus API-only models. */
export function LandscapeTable() {
  return (
    <div className="llm-table-wrap">
      <table className="llm-table">
        <thead>
          <tr>
            <th />
            <th>Open-weight</th>
            <th>API-only</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, open, api]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{open}</td>
              <td>{api}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
