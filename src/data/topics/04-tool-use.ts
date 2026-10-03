import type { Topic } from '../../types'

export const toolUse: Topic = {
  id: 'tool-use',
  number: 4,
  title: 'Tool Use (Function Calling)',
  group: 'agents',
  summary: 'Let a model take actions in the world through your code.',
  sections: [
    {
      title: 'The concept',
      points: [
        'Why models need tools (fresh data, computation, actions)',
        'The flow: model requests a tool → your code runs it → you return the result → model continues',
      ],
    },
    {
      title: 'Defining tools',
      points: [
        'Tool names, descriptions, and JSON Schema for parameters',
        'Why tool descriptions matter as much as prompts',
      ],
    },
    {
      title: 'Handling tool calls',
      points: [
        'Parsing the model\'s tool request',
        'Executing the function safely',
        'Returning results and errors back to the model',
        'Parallel tool calls',
      ],
    },
    {
      title: 'Designing good tools',
      points: [
        'Keeping tools focused and well-named',
        'Returning useful, concise results (not giant data dumps)',
        'Writing error messages the model can act on',
      ],
    },
  ],
  sources: [
  ],
  project: 'An assistant with three tools: a calculator, a weather lookup, and a note-saver that writes to a file.',
  scenarios: ['weather'],
  concepts: ['tool_selection', 'tool_call', 'tool_result', 'observe'],
}
