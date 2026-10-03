import type { Topic } from '../../types'

export const agentLoop: Topic = {
  id: 'agent-loop',
  number: 5,
  title: 'The Agent Loop',
  group: 'agents',
  summary: 'Build a working agent from scratch, with no framework.',
  sections: [
    {
      title: 'What makes something an agent',
      points: [
        'Workflows (predefined steps) vs. agents (model decides the steps)',
        'Autonomy levels and when each is appropriate',
      ],
    },
    {
      title: 'The core loop',
      points: [
        'Think → act → observe → repeat',
        'Stopping conditions: task complete, max iterations, errors',
      ],
    },
    {
      title: 'Key patterns',
      points: [
        'ReAct (reasoning + acting)',
        'Plan-and-execute',
        'Reflection and self-critique',
      ],
    },
    {
      title: 'Building it yourself',
      points: [
        'Writing the loop in under 100 lines',
        'Managing the growing message history',
        'Logging every step so you can see what the agent is doing',
      ],
    },
    {
      title: 'Common failure modes',
      points: [
        'Infinite loops and repeated actions',
        'The agent giving up too early or claiming false success',
        'Tool misuse',
      ],
    },
  ],
  sources: [
    { title: 'Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2022)', url: 'https://arxiv.org/abs/2210.03629' },
    { title: 'Anthropic, "Building Effective Agents" (2024)', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
  ],
  project: 'A from-scratch agent that can answer multi-step questions using web search and a calculator.',
  scenarios: ['weather', 'coding'],
  concepts: ['planning', 'reasoning', 'observe'],
}
