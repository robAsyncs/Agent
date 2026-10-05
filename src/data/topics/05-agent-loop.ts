import { AgentLoopArticle } from '../../content/agent-loop/Article'
import type { Topic } from '../../types'

export const agentLoop: Topic = {
  id: 'agent-loop',
  number: 5,
  title: 'The Agent Loop',
  group: 'agents',
  summary: 'Build a working agent from scratch, with no framework.',
  sections: [],
  article: AgentLoopArticle,
  sources: [
    { title: 'Anthropic, "Building Effective Agents" (2024)', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
    { title: 'Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2022)', url: 'https://arxiv.org/abs/2210.03629' },
    { title: 'Wang et al., "Plan-and-Solve Prompting" (2023)', url: 'https://arxiv.org/abs/2305.04091' },
    { title: 'Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023)', url: 'https://arxiv.org/abs/2303.11366' },
    { title: 'Madaan et al., "Self-Refine: Iterative Refinement with Self-Feedback" (2023)', url: 'https://arxiv.org/abs/2303.17651' },
    { title: 'Thorsten Ball, "How to Build an Agent" (2025)', url: 'https://ampcode.com/how-to-build-an-agent' },
    { title: 'Simon Willison, "Designing agentic loops" (2025)', url: 'https://simonwillison.net/2025/Sep/30/designing-agentic-loops/' },
    { title: 'Anthropic, "Effective context engineering for AI agents" (2025)', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
    { title: 'Anthropic, "Stop reasons and fallback"', url: 'https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons' },
    { title: 'Lilian Weng, "LLM Powered Autonomous Agents" (2023)', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/' },
    { title: 'Cemri et al., "Why Do Multi-Agent LLM Systems Fail?" (2025)', url: 'https://arxiv.org/abs/2503.13657' },
  ],
  project: 'A from-scratch agent that can answer multi-step questions using web search and a calculator.',
  scenarios: ['weather', 'coding'],
  concepts: ['planning', 'reasoning', 'observe'],
}
