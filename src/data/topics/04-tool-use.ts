import { ToolUseArticle } from '../../content/tool-use/Article'
import type { Topic } from '../../types'

export const toolUse: Topic = {
  id: 'tool-use',
  number: 4,
  title: 'Tool Use (Function Calling)',
  group: 'agents',
  summary: 'Let a model take actions in the world through your code.',
  sections: [],
  article: ToolUseArticle,
  sources: [
    { title: 'Anthropic, "Tool use with Claude"', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview' },
    { title: 'Anthropic, "Define tools"', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use' },
    { title: 'Anthropic, "Handle tool calls"', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls' },
    { title: 'Anthropic, "Parallel tool use"', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use' },
    { title: 'Anthropic, "Strict tool use"', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use' },
    { title: 'Anthropic, "Tool runner (SDK)"', url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner' },
    { title: 'Anthropic, "Writing effective tools for agents" (2025)', url: 'https://www.anthropic.com/engineering/writing-tools-for-agents' },
    { title: 'Anthropic, "Building Effective Agents" (2024)', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
    { title: 'OpenAI, "Function calling" guide', url: 'https://platform.openai.com/docs/guides/function-calling' },
    { title: 'JSON Schema, "Understanding JSON Schema"', url: 'https://json-schema.org/understanding-json-schema' },
    { title: 'Schick et al., "Toolformer: Language Models Can Teach Themselves to Use Tools" (2023)', url: 'https://arxiv.org/abs/2302.04761' },
    { title: 'Patil et al., "Gorilla: Large Language Model Connected with Massive APIs" (2023)', url: 'https://arxiv.org/abs/2305.15334' },
    { title: 'Berkeley Function Calling Leaderboard', url: 'https://gorilla.cs.berkeley.edu/leaderboard.html' },
  ],
  project: 'An assistant with three tools: a calculator, a weather lookup, and a note-saver that writes to a file.',
  scenarios: ['weather'],
  concepts: ['tool_selection', 'tool_call', 'tool_result', 'observe'],
}
