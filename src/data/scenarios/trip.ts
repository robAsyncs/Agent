import type { Scenario } from '../../types'
import { ctx } from './ctx'

const SYSTEM =
  'You are a travel-planning agent. Plan before acting. Respect the user\'s budget and stored preferences. You may call several tools in parallel when they are independent.'

const MEMORIES = ['Prefers window seats', 'Vegetarian', 'Likes walkable neighbourhoods', 'Home airport: IAD']

const REQUEST = 'Plan me a long weekend in Lisbon in mid-October, under $1,200 total.'

const FLIGHTS = [
  { id: 'TP204', airline: 'TAP', depart: 'Oct 16 18:10 IAD', arrive: 'Oct 17 06:55 LIS', price: 612, seat: '23A' },
  { id: 'UA966', airline: 'United', depart: 'Oct 16 21:40 IAD', arrive: 'Oct 17 10:05 LIS', price: 688 },
]

const HOTELS = [
  { name: 'Casa do Largo', area: 'Alfama', nights: 3, total: 402, rating: 4.6 },
  { name: 'Baixa Loft', area: 'Baixa', nights: 3, total: 465, rating: 4.4 },
]

const PLAN = [
  '1. check_calendar → find a free Thu–Mon in mid-October',
  '2. search_flights + search_hotels (independent, run in parallel)',
  '3. Pick the combo that fits $1,200 and the stored preferences',
  '4. Present the itinerary',
].join('\n')

const PARALLEL_CALLS = [
  { type: 'tool_use', id: 'toolu_02', name: 'search_flights', input: { from: 'IAD', to: 'LIS', depart: '2026-10-16', return: '2026-10-20', seat: 'window' } },
  { type: 'tool_use', id: 'toolu_03', name: 'search_hotels', input: { city: 'Lisbon', check_in: '2026-10-17', nights: 3, walkable: true } },
]

const ITINERARY =
  '✈  TAP TP204, Oct 16 IAD → LIS, window seat 23A: $612\n🏨 Casa do Largo (Alfama), 3 nights: $402\n💶 ~$186 left for food & trams\n🥗 Veggie picks: Ao 26, Jardim dos Sentidos'

export const trip: Scenario = {
  id: 'trip',
  title: 'Trip planner',
  tagline: 'Memory, planning, and parallel tool calls working together.',
  steps: [
    {
      kind: 'system_prompt',
      from: 'agent',
      to: 'llm',
      label: 'inject system prompt',
      note: 'This system prompt explicitly encourages planning and parallel tool use.',
      payload: { system: SYSTEM },
      context: ctx('system', 'System prompt', SYSTEM),
    },
    {
      kind: 'memory_read',
      from: 'agent',
      to: 'memory',
      label: 'load memories(user_42)',
      note: 'Before the first model call, the harness fetches what it knows about this user from long-term memory.',
      payload: { user_id: 'user_42', namespace: 'preferences' },
    },
    {
      kind: 'memory_read',
      from: 'memory',
      to: 'agent',
      label: '4 memories',
      note: 'The memories are injected into the context, so the model sees them just like the system prompt.',
      payload: MEMORIES,
      context: ctx('system', 'User memories (4)', MEMORIES),
    },
    {
      kind: 'user_prompt',
      from: 'user',
      to: 'agent',
      label: '"Lisbon, mid-Oct, <$1,200"',
      note: 'An open-ended request that needs several pieces of information.',
      payload: { role: 'user', content: REQUEST },
      context: ctx('user', '"Lisbon long weekend…"', REQUEST),
    },
    {
      kind: 'llm_request',
      from: 'agent',
      to: 'llm',
      label: 'messages.create()',
      note: 'Three tools are available: check_calendar, search_flights, and search_hotels.',
      payload: {
        model: 'claude-sonnet-5-5',
        tools: ['check_calendar', 'search_flights', 'search_hotels', 'remember'].map((name) => ({ name, '…': '…' })),
        messages: [{ role: 'user', content: REQUEST }],
      },
    },
    {
      kind: 'planning',
      from: 'llm',
      to: 'llm',
      label: 'plan: 4 steps',
      note: 'The task has dependencies: flights and hotels depend on the dates. The model plans the order first.',
      payload: PLAN,
      context: ctx('assistant', 'plan (4 steps)', PLAN),
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: check_calendar',
      note: 'Step 1 of the plan. Dates must be known before searching.',
      payload: { type: 'tool_use', id: 'toolu_01', name: 'check_calendar', input: { from: '2026-10-10', to: '2026-10-25' } },
      context: ctx('assistant', 'tool_use check_calendar', { from: '2026-10-10', to: '2026-10-25' }),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: 'check_calendar(Oct 10–25)',
      note: 'The harness calls the user\'s calendar API.',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: 'free: Oct 16–20',
      note: 'Only one long weekend is free.',
      payload: { free_windows: [{ start: '2026-10-16', end: '2026-10-20' }] },
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'tool_result → model',
      note: 'The model observes the result and continues with step 2 of its plan.',
      context: ctx('tool_result', 'calendar: Oct 16–20', { free_windows: [{ start: '2026-10-16', end: '2026-10-20' }] }),
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use ×2 (parallel)',
      note: 'Parallel tool use: flights and hotels do not depend on each other, so the model requests both in one response.',
      payload: { content: PARALLEL_CALLS, stop_reason: 'tool_use' },
      context: ctx('assistant', 'tool_use ×2', PARALLEL_CALLS),
    },
    {
      kind: 'tool_call',
      from: 'agent',
      to: 'tools',
      label: 'search_flights + search_hotels',
      note: 'The harness can run both concurrently, which saves wall-clock time.',
    },
    {
      kind: 'tool_result',
      from: 'tools',
      to: 'agent',
      label: '2 flights, 2 hotels',
      note: 'Both results return. Notice the stored "window seat" preference was passed as a filter.',
      payload: { flights: FLIGHTS, hotels: HOTELS },
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'tool_result ×2 → model',
      note: 'Both tool_result blocks go back in one user message, each matched to its tool_use_id.',
      context: ctx('tool_result', 'flights + hotels', { flights: FLIGHTS, hotels: HOTELS }),
    },
    {
      kind: 'reasoning',
      from: 'llm',
      to: 'llm',
      label: 'budget math',
      note: 'Step 3: the model compares options against the constraints.',
      payload:
        'TP204 $612 + Casa do Largo $402 = $1,014 → $186 left for food/transport. Under budget ✓. Alfama is walkable ✓. Window seat 23A ✓. The UA + Baixa combo is $1,153, too tight.',
    },
    {
      kind: 'memory_write',
      from: 'agent',
      to: 'memory',
      label: 'remember("likes Alfama")',
      note: 'Alongside its answer, the model called a "remember" tool (its tool_use step is omitted for brevity). The harness writes the fact to long-term memory for future trips.',
      payload: { user_id: 'user_42', fact: 'Chose Alfama in Lisbon; enjoys historic neighbourhoods', source: 'trip-2026-10' },
    },
    {
      kind: 'final_response',
      from: 'llm',
      to: 'agent',
      label: 'stop_reason: end_turn',
      note: 'All plan steps are done, so the model writes the itinerary.',
      context: ctx('assistant', 'itinerary', ITINERARY),
    },
    {
      kind: 'final_response',
      from: 'agent',
      to: 'user',
      label: 'itinerary: $1,014',
      note: 'Three tool calls in two rounds, thanks to parallelism, plus one memory read and one memory write.',
      payload: ITINERARY,
    },
  ],
}
