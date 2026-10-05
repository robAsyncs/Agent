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
        'Goal decomposition: breaking a goal into subgoals and tasks',
        'Search-based planning: states, actions and searching for a path to the goal (STRIPS, A*), and LLM versions such as Tree of Thoughts and tree search',
        'Planning graphs: Graphplan and why explicit search gets expensive',
        'ReAct: choosing one step at a time instead of searching (recap of Topic 5)',
        'Plan-and-execute: a plan written up front, with dynamic replanning when things go wrong',
        'Hierarchical planning: high-level plans refined into subtasks, the bridge to orchestrator-worker systems',
        'Planning with memory: keeping plans and progress in a scratchpad, reusing past plans and skills',
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
    { title: 'Fikes & Nilsson, "STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving" (1971)', url: 'https://doi.org/10.1016/0004-3702(71)90010-5' },
    { title: 'Blum & Furst, "Fast Planning Through Planning Graph Analysis" (1997)', url: 'https://doi.org/10.1016/S0004-3702(96)00047-1' },
    { title: 'Yao et al., "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (2023)', url: 'https://arxiv.org/abs/2305.10601' },
    { title: 'Hao et al., "Reasoning with Language Model is Planning with World Model" (2023)', url: 'https://arxiv.org/abs/2305.14992' },
    { title: 'Zhou et al., "Language Agent Tree Search" (2023)', url: 'https://arxiv.org/abs/2310.04406' },
    { title: 'Wang et al., "Plan-and-Solve Prompting" (2023)', url: 'https://arxiv.org/abs/2305.04091' },
    { title: 'Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023)', url: 'https://arxiv.org/abs/2304.03442' },
    { title: 'Wang et al., "Voyager: An Open-Ended Embodied Agent with Large Language Models" (2023)', url: 'https://arxiv.org/abs/2305.16291' },
    { title: 'Anthropic, "Building Effective Agents" (2024)', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
  ],
  project: 'A research agent where an orchestrator splits a question into subtopics, sends worker agents to research each, and combines the findings into a report.',
  scenarios: ['trip'],
  concepts: ['planning'],
}
