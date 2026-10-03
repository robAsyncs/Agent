import type { GlossaryEntry } from './types'

/** Terms introduced in Topic 3. */
export const LLM_APIS_TERMS = {
  'api-key': {
    term: 'API key',
    definition:
      'A secret string that identifies your account on every request. Keep it in an environment variable or a secrets manager, never in source code.',
  },
  sdk: {
    term: 'SDK',
    definition:
      'An official client library (e.g. the anthropic Python package) that wraps the HTTP API with typed requests, streaming helpers and automatic retries.',
  },
  'max-tokens': {
    term: 'max_tokens',
    definition:
      'A hard cap on how many tokens the model may generate in one response. If it is hit, the reply is cut off and stop_reason is "max_tokens".',
  },
  'content-blocks': {
    term: 'Content blocks',
    definition:
      'A response’s content is a list of typed blocks (text, tool_use, thinking…) rather than one string, so code should check each block’s type.',
  },
  'stop-reason': {
    term: 'stop_reason',
    definition:
      'Why generation ended: end_turn (finished), max_tokens (cut off), tool_use (wants a tool run), stop_sequence, or refusal.',
  },
  sse: {
    term: 'Server-sent events',
    definition:
      'A simple HTTP streaming format: the server keeps the connection open and writes “event:” and “data:” lines as things happen.',
  },
  'few-shot': {
    term: 'Few-shot prompting',
    definition:
      'Including a few worked examples of input and desired output in the prompt so the model copies the pattern and format.',
    topic: 'language-to-agents',
  },
  'xml-tags': {
    term: 'XML tags',
    definition:
      'Wrapping parts of a prompt in tags like <email>…</email> so the model can tell instructions apart from the data it should work on.',
  },
  'structured-outputs': {
    term: 'Structured outputs',
    definition:
      'An API feature that constrains the response to a JSON schema you supply, so the reply always parses and has the required fields.',
  },
  pydantic: {
    term: 'Pydantic',
    definition:
      'A Python library that defines data shapes as classes and validates input against them, raising a detailed error when something does not fit.',
  },
  'rate-limit': {
    term: 'Rate limits',
    definition:
      'Caps on how many requests and tokens you may send per minute. Going over returns HTTP 429 with a retry-after header.',
  },
  backoff: {
    term: 'Exponential backoff',
    definition:
      'Retrying a failed request after waits that double each time (1s, 2s, 4s…), plus random jitter so many clients do not retry in lockstep.',
  },
  'prompt-caching': {
    term: 'Prompt caching',
    definition:
      'Reusing the processed form of an identical prompt prefix across requests. Cached reads are far cheaper and faster than processing the prefix again.',
  },
  multimodal: {
    term: 'Multimodal input',
    definition:
      'Sending more than text: images and PDFs go into the same messages list as content blocks alongside the text.',
  },
} satisfies Record<string, GlossaryEntry>
