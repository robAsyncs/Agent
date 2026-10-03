import { LlmApisArticle } from '../../content/llm-apis/Article'
import type { Topic } from '../../types'

export const llmApis: Topic = {
  id: 'llm-apis',
  number: 3,
  title: 'Working With LLM APIs',
  group: 'foundations',
  summary: 'Call models directly and control their output reliably.',
  sections: [],
  article: LlmApisArticle,
  sources: [
    { title: 'Anthropic, "Messages" API reference', url: 'https://platform.claude.com/docs/en/api/messages' },
    { title: 'Anthropic, "Streaming messages"', url: 'https://platform.claude.com/docs/en/build-with-claude/streaming' },
    { title: 'Anthropic, prompt engineering overview', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview' },
    { title: 'Anthropic, "Prompting best practices"', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices' },
    { title: 'Anthropic, interactive prompt engineering tutorial', url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial' },
    { title: 'Anthropic, "Structured outputs"', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
    { title: 'Pydantic documentation', url: 'https://docs.pydantic.dev/latest/' },
    { title: 'Anthropic, "Token counting"', url: 'https://platform.claude.com/docs/en/build-with-claude/token-counting' },
    { title: 'Anthropic, "Pricing"', url: 'https://platform.claude.com/docs/en/about-claude/pricing' },
    { title: 'Anthropic, "Rate limits"', url: 'https://platform.claude.com/docs/en/api/rate-limits' },
    { title: 'Anthropic, "Claude API errors"', url: 'https://platform.claude.com/docs/en/api/errors' },
    { title: 'Anthropic, "Prompt caching"', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
    { title: 'Anthropic, "Vision"', url: 'https://platform.claude.com/docs/en/build-with-claude/vision' },
    { title: 'Anthropic, "PDF support"', url: 'https://platform.claude.com/docs/en/build-with-claude/pdf-support' },
    { title: 'Anthropic Python SDK', url: 'https://github.com/anthropics/anthropic-sdk-python' },
    { title: 'OpenAI Cookbook', url: 'https://cookbook.openai.com/' },
  ],
  project: 'A command-line chatbot with conversation memory that can switch personas via the system prompt.',
  scenarios: ['weather'],
  concepts: ['system_prompt', 'user_prompt', 'llm_request', 'final_response'],
}
