import type { Topic } from '../../types'

export const advancedArchitectures: Topic = {
  id: 'advanced-architectures',
  number: 7,
  title: 'Advanced Agent Architectures',
  group: 'advanced',
  summary: 'Handle complex, long-running, multi-part tasks.',
  sections: [
    {
      title: 'Workflow patterns',
      points: [
        'Prompt chaining',
        'Routing (sending tasks to specialized handlers)',
        'Parallelization',
        'Evaluator-optimizer loops',
      ],
    },
    {
      title: 'Planning',
      points: [
        'Task decomposition',
        'Dynamic replanning when things go wrong',
      ],
    },
    {
      title: 'Multi-agent systems',
      points: [
        'Orchestrator-worker setups',
        'Specialist agents and handoffs',
        'Communication between agents',
        'When multiple agents help and when they just add complexity',
      ],
    },
    {
      title: 'Long-running agents',
      points: [
        'Saving state and resuming',
        'Checkpointing progress',
        'Handling tasks that span hours',
      ],
    },
    {
      title: 'Human-in-the-loop',
      points: [
        'Approval steps for risky actions',
        'Asking clarifying questions',
        'Interrupting and redirecting agents',
      ],
    },
  ],
  sources: [
  ],
  project: 'A research agent where an orchestrator splits a question into subtopics, sends worker agents to research each, and combines the findings into a report.',
  scenarios: ['trip'],
  concepts: ['planning'],
}
