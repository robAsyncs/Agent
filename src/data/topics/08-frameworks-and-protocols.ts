import type { Topic } from '../../types'

export const frameworksAndProtocols: Topic = {
  id: 'frameworks-and-protocols',
  number: 8,
  title: 'Frameworks, SDKs, and Protocols',
  group: 'advanced',
  summary: 'Use existing tools productively now that you understand what they abstract.',
  sections: [
    {
      title: 'Agent frameworks',
      points: [
        'LangGraph (graph-based agent workflows)',
        'Claude Agent SDK',
        'OpenAI Agents SDK',
        'CrewAI, AutoGen, and others',
        'Comparing tradeoffs: control vs. convenience',
      ],
    },
    {
      title: 'Model Context Protocol (MCP)',
      points: [
        'What problem MCP solves',
        'Clients, servers, tools, and resources',
        'Using existing MCP servers',
        'Building your own MCP server',
      ],
    },
    {
      title: 'Coding agents',
      points: [
        'How tools like Claude Code work',
        'Agents that read, write, and run code',
        'Sandboxing code execution',
      ],
    },
    {
      title: 'Computer and browser use',
      points: [
        'Agents that control browsers or desktops',
        'Current capabilities and limits',
      ],
    },
  ],
  sources: [],
  project: 'Rebuild your Module 5 agent in a framework, then build an MCP server that exposes one of your own tools.',
  scenarios: ['coding'],
}
