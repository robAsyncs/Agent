import type { Topic } from '../../types'

export const finalProject: Topic = {
  id: 'final-project',
  number: null,
  title: 'Final Project',
  group: 'final',
  summary: 'An end-to-end agent that combines everything above.',
  sections: [
    {
      title: 'What it includes',
      points: [
        'Tool use',
        'Memory or RAG',
        'A well-designed agent loop',
        'An evaluation suite',
        'Safety guardrails',
      ],
    },
  ],
  sources: [
  ],
  project: 'An end-to-end agent, deployed somewhere others can try it.',
}
