import type { Scenario } from '../../types'
import { ctx } from './ctx'

const SYSTEM = 'You are a friendly assistant. Use tools for live data. Keep answers short and practical.'

export const weather: Scenario = {
  id: 'weather',
  title: 'Weather lookup',
  tagline: 'The simplest agent loop: one tool call, one answer.',
  steps: [
    {
      kind: 'system_prompt',
      from: 'agent',
      to: 'llm',
      label: 'inject system prompt',
      note: 'Before anything else, the harness sets up the model\'s instructions. This is re-sent with every request.',
      payload: { system: SYSTEM },
      context: ctx('system', 'System prompt', SYSTEM),
    },
    {
      kind: 'user_prompt',
      from: 'user',
      to: 'agent',
      label: '"Weather in Lisbon? Umbrella?"',
      note: 'The user asks a question that needs live data the model does not have.',
      payload: { role: 'user', content: 'What\'s the weather in Lisbon today? Do I need an umbrella?' },
      context: ctx('user', '"Weather in Lisbon…"', 'What\'s the weather in Lisbon today? Do I need an umbrella?'),
    },
    {
      kind: 'llm_request',
      from: 'agent',
      to: 'llm',
      label: 'messages.create()',
      note: 'The harness sends system prompt + messages + the get_weather tool schema in a single API call.',
      payload: {
        model: 'claude-sonnet-5-5',
        system: SYSTEM,
        tools: [
          {
            name: 'get_weather',
            description: 'Get the current weather and today\'s forecast for a city.',
            input_schema: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] },
          },
        ],
        messages: [{ role: 'user', content: 'What\'s the weather in Lisbon today? Do I need an umbrella?' }],
      },
    },
    {
      kind: 'reasoning',
      from: 'llm',
      to: 'llm',
      label: 'thinking…',
      note: 'The model realises it cannot know today\'s weather from training data and decides to use the tool.',
      payload:
        'User wants today\'s weather in Lisbon plus umbrella advice. I don\'t have live data. The get_weather tool fits exactly: call it with city="Lisbon".',
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: get_weather',
      note: 'Instead of text, the model returns a tool_use block and stops. stop_reason "tool_use" tells the harness to run a tool.',
      payload: {
        content: [{ type: 'tool_use', id: 'toolu_01', name: 'get_weather', input: { city: 'Lisbon' } }],
        stop_reason: 'tool_use',
      },
      context: ctx('assistant', 'tool_use get_weather', { name: 'get_weather', input: { city: 'Lisbon' } }),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: 'get_weather("Lisbon")',
      note: 'The harness, not the model, executes the real function: here an HTTP call to a weather API.',
      payload: 'GET https://api.weather.example/v1/forecast?city=Lisbon',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: '{ 18°C, rain 70% }',
      note: 'The API responds with structured data.',
      payload: { temp_c: 18, condition: 'cloudy', precipitation_chance: 0.7, rain_expected: '15:00–18:00' },
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'tool_result → model',
      note: 'The result is appended as a tool_result message and the model is called again with the whole history.',
      payload: {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: 'toolu_01',
            content: '{"temp_c":18,"condition":"cloudy","precipitation_chance":0.7,"rain_expected":"15:00–18:00"}',
          },
        ],
      },
      context: ctx('tool_result', 'weather data', { temp_c: 18, condition: 'cloudy', precipitation_chance: 0.7 }),
    },
    {
      kind: 'reasoning',
      from: 'llm',
      to: 'llm',
      label: 'thinking…',
      note: 'With real data in its context, the model can now answer both parts of the question.',
      payload: '70% chance of rain in the afternoon: recommend the umbrella. Mention the time window so it\'s actionable.',
    },
    {
      kind: 'final_response',
      from: 'llm',
      to: 'agent',
      label: 'stop_reason: end_turn',
      note: 'The model answers in text. end_turn means "I\'m done", so the loop exits.',
      payload: {
        content: [
          {
            type: 'text',
            text: 'It\'s 18°C and cloudy in Lisbon. Yes, bring an umbrella: there\'s a 70% chance of rain between 3 and 6 pm.',
          },
        ],
        stop_reason: 'end_turn',
      },
      context: ctx('assistant', 'final answer', 'It\'s 18°C and cloudy in Lisbon. Yes, bring an umbrella: there\'s a 70% chance of rain between 3 and 6 pm.'),
    },
    {
      kind: 'final_response',
      from: 'agent',
      to: 'user',
      label: '"Yes, bring an umbrella"',
      note: 'The harness shows the answer. The whole exchange took two model calls and one tool call.',
      payload: 'It\'s 18°C and cloudy in Lisbon. Yes, bring an umbrella: there\'s a 70% chance of rain between 3 and 6 pm.',
    },
  ],
}
