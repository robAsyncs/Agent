import type { GlossaryEntry } from './types'

/** Terms introduced in Topic 4. */
export const TOOL_USE_TERMS = {
  'function-calling': {
    term: 'Function calling',
    definition:
      'Another name for tool use: the model replies with the name of a function and JSON arguments instead of prose, and your code runs it.',
  },
  'json-schema': {
    term: 'JSON Schema',
    definition:
      'A standard way to describe the shape of JSON data: which fields exist, their types, which are required and which values are allowed.',
  },
  'input-schema': {
    term: 'input_schema',
    definition:
      'The JSON Schema in a tool definition that describes the tool’s arguments. The model fills in an object that should match it.',
  },
  'tool-use-block': {
    term: 'tool_use block',
    definition:
      'A content block in the model’s reply that asks for a tool to be run. It carries an id, the tool name and an input object.',
  },
  'tool-result': {
    term: 'tool_result block',
    definition:
      'A content block your code sends back in the next user message. Its tool_use_id ties it to the request it answers.',
  },
  'is-error': {
    term: 'is_error',
    definition:
      'A flag on a tool_result that tells the model the tool failed. The content explains what went wrong so the model can retry or change course.',
  },
  'parallel-tools': {
    term: 'Parallel tool calls',
    definition:
      'One reply that contains several tool_use blocks. Run them together and return every result in a single user message.',
  },
  'tool-choice': {
    term: 'tool_choice',
    definition:
      'A request setting for whether the model may use tools: auto (the model decides) or none. Some models also allow forcing a call.',
  },
  'strict-tools': {
    term: 'Strict tool use',
    definition:
      'Setting strict: true on a tool definition so the API guarantees the tool’s input matches its schema exactly.',
  },
  'tool-runner': {
    term: 'Tool runner',
    definition:
      'An SDK helper that runs the request → execute tools → send results loop for you. You write only the tool functions.',
    topic: 'agent-loop',
  },
} satisfies Record<string, GlossaryEntry>
