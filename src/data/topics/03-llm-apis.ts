import type { Topic } from '../../types'

export const llmApis: Topic = {
  id: 'llm-apis',
  number: 3,
  title: 'Working With LLM APIs',
  group: 'foundations',
  summary: 'Call models directly and control their output reliably.',
  sections: [
    {
      title: 'API fundamentals',
      points: [
        'Getting an API key and setting up the SDK',
        'The messages format: system, user, and assistant roles',
        'Statelessness: resending conversation history every call',
        'Streaming responses',
      ],
    },
    {
      title: 'Prompt engineering',
      points: [
        'Writing clear, specific instructions',
        'System prompts and role setting',
        'Few-shot examples',
        'Asking for step-by-step reasoning',
        'Using delimiters or XML tags to separate instructions from data',
      ],
    },
    {
      title: 'Structured output',
      points: [
        'Getting reliable JSON back',
        'Validating output with Pydantic',
        'Handling malformed responses and retries',
      ],
    },
    {
      title: 'Practical concerns',
      points: [
        'Token counting and cost estimation',
        'Rate limits and exponential backoff',
        'Prompt caching',
        'Multimodal inputs (images, PDFs)',
      ],
    },
  ],
  sources: [
    { title: 'Anthropic, prompt engineering overview', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview' },
    { title: 'Anthropic, interactive prompt engineering tutorial', url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial' },
    { title: 'OpenAI Cookbook', url: 'https://cookbook.openai.com/' },
  ],
  project: 'A command-line chatbot with conversation memory that can switch personas via the system prompt.',
  scenarios: ['weather'],
  concepts: ['system_prompt', 'user_prompt', 'llm_request', 'final_response'],
}
