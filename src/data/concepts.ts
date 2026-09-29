import type { ActionKind, Concept } from '../types'

export const CONCEPTS: Concept[] = [
  // ─── Core loop ────────────────────────────────────────────────
  {
    kind: 'system_prompt',
    title: 'System prompt injection',
    category: 'core',
    summary: 'The hidden instructions that define who the agent is and how it behaves.',
    description:
      'Before the user says anything, the agent harness places a system prompt at the very top of the context. It sets the role, the rules, the output format and often describes the available tools. The user normally never sees it, but the model reads it on every single turn.',
    whyItMatters:
      'The model has no memory between requests. The system prompt is re-sent every time, so it is the most reliable place to put behaviour that must always hold.',
    example: {
      steps: [
        {
          kind: 'system_prompt',
          from: 'agent',
          to: 'llm',
          label: 'system: "You are a helpful…"',
          note: 'The harness injects the system prompt as the first part of the request.',
          payload: {
            system:
              'You are a helpful travel assistant. Be concise. Always confirm dates before booking. Use tools when you need live data.',
          },
        },
      ],
    },
  },
  {
    kind: 'user_prompt',
    title: 'User prompt',
    category: 'core',
    summary: 'The request from the human that starts (or continues) the task.',
    description:
      'The user message is added to the conversation history as a "user" turn. The agent harness receives it first, and can validate it, enrich it with context (time, user profile, attached files) and then forward it to the model.',
    whyItMatters:
      'Everything the agent does is in service of this message. Ambiguous prompts lead to ambiguous plans, which is why good agents ask clarifying questions.',
    example: {
      steps: [
        {
          kind: 'user_prompt',
          from: 'user',
          to: 'agent',
          label: '"What\'s the weather in Paris?"',
          note: 'The user types a message; the harness appends it to the messages array.',
          payload: { role: 'user', content: "What's the weather in Paris?" },
        },
      ],
    },
  },
  {
    kind: 'llm_request',
    title: 'LLM request',
    category: 'core',
    summary: 'The harness bundles system prompt, history and tool definitions into one API call.',
    description:
      'The model is stateless. Every call sends the full picture: the system prompt, every previous message (including earlier tool calls and results), and the JSON schemas of the tools the model is allowed to use.',
    whyItMatters:
      'This is why context windows fill up: each loop iteration re-sends everything. It is also why tool descriptions matter so much. The model only knows what a tool does from its description.',
    example: {
      steps: [
        {
          kind: 'llm_request',
          from: 'agent',
          to: 'llm',
          label: 'POST /v1/messages',
          note: 'One request = system + messages + tools.',
          payload: {
            model: 'claude-sonnet-5-5',
            max_tokens: 1024,
            system: 'You are a helpful assistant…',
            tools: [
              {
                name: 'get_weather',
                description: 'Get current weather for a city',
                input_schema: {
                  type: 'object',
                  properties: { city: { type: 'string' } },
                  required: ['city'],
                },
              },
            ],
            messages: [{ role: 'user', content: "What's the weather in Paris?" }],
          },
        },
      ],
    },
  },
  {
    kind: 'reasoning',
    title: 'Reasoning',
    category: 'core',
    summary: 'The model thinks through the problem before deciding what to do.',
    description:
      'Modern models can produce a reasoning trace ("extended thinking") before the visible answer. The model weighs what it knows, what it is missing, and what to do next. This happens inside the LLM, so no other component is involved.',
    whyItMatters:
      'Reasoning is where the model decides between answering directly and calling a tool. Better reasoning means fewer wasted tool calls and fewer wrong answers.',
    example: {
      steps: [
        {
          kind: 'reasoning',
          from: 'llm',
          to: 'llm',
          label: 'thinking…',
          note: 'The model reasons internally before producing output.',
          payload:
            "The user wants current weather. I don't have live data, but I have a get_weather tool. I should call it with city=\"Paris\".",
        },
      ],
    },
  },
  {
    kind: 'final_response',
    title: 'Final response',
    category: 'core',
    summary: 'The model stops calling tools and answers the user.',
    description:
      'When the model responds with plain text and stop_reason "end_turn" (instead of "tool_use"), the loop is over. The harness takes the text and shows it to the user.',
    whyItMatters:
      'The stop_reason is how the harness knows whether to keep looping or return control to the user. It is the exit condition of the agent loop.',
    example: {
      steps: [
        {
          kind: 'final_response',
          from: 'llm',
          to: 'agent',
          label: 'stop_reason: end_turn',
          note: 'The model returns text instead of a tool call.',
          payload: {
            role: 'assistant',
            content: [{ type: 'text', text: "It's 18°C and sunny in Paris." }],
            stop_reason: 'end_turn',
          },
        },
        {
          kind: 'final_response',
          from: 'agent',
          to: 'user',
          label: '"It\'s 18°C and sunny"',
          note: 'The harness displays the answer.',
        },
      ],
    },
  },

  // ─── Planning & tools ─────────────────────────────────────────
  {
    kind: 'planning',
    title: 'Planning',
    category: 'planning',
    summary: 'Breaking a big task into an ordered list of smaller steps.',
    description:
      'For multi-step tasks the model first writes a plan: which information it needs, in what order, and which tools will get it. Some agents store the plan as a to-do list and update it as steps complete.',
    whyItMatters:
      'Without a plan, agents wander: they repeat calls, forget sub-goals, or stop early. A written plan keeps long tasks on track and makes the agent\'s behaviour easy to inspect.',
    example: {
      steps: [
        {
          kind: 'planning',
          from: 'llm',
          to: 'llm',
          label: 'plan: 4 steps',
          note: 'The model outlines its approach.',
          payload: [
            '1. Check the user\'s calendar for free dates',
            '2. Search flights for those dates',
            '3. Search hotels near the city centre',
            '4. Combine into an itinerary under budget',
          ].join('\n'),
        },
      ],
    },
  },
  {
    kind: 'tool_selection',
    title: 'Tool selection',
    category: 'planning',
    summary: 'The model picks a tool and writes the arguments as structured JSON.',
    description:
      'The model cannot run code itself. Instead it emits a tool_use block that names a tool and gives the input arguments, then stops with stop_reason "tool_use". The model can request several tools at once (parallel tool use).',
    whyItMatters:
      'This is the bridge from language to action. The model picks the tool based only on the names, descriptions and schemas it was given in the request.',
    example: {
      steps: [
        {
          kind: 'tool_selection',
          from: 'llm',
          to: 'agent',
          label: 'tool_use: get_weather',
          note: 'The model asks the harness to run a tool.',
          payload: {
            role: 'assistant',
            content: [
              {
                type: 'tool_use',
                id: 'toolu_01A',
                name: 'get_weather',
                input: { city: 'Paris' },
              },
            ],
            stop_reason: 'tool_use',
          },
        },
      ],
    },
  },
  {
    kind: 'tool_call',
    title: 'Tool execution',
    category: 'planning',
    summary: 'The harness actually runs the function the model asked for.',
    description:
      'Your code receives the tool_use block, validates the arguments, and executes the real function: an HTTP API, a database query, a shell command, a file edit. The model is not involved in this step at all.',
    whyItMatters:
      'This is where safety lives. The harness decides whether a call is allowed, can ask a human for approval, and controls timeouts and sandboxing.',
    example: {
      steps: [
        {
          kind: 'tool_call',
          from: 'agent',
          to: 'tools',
          label: 'get_weather("Paris")',
          note: 'The harness calls the real weather API.',
          payload: 'GET https://api.weather.example/v1/current?city=Paris',
        },
      ],
    },
  },
  {
    kind: 'tool_result',
    title: 'Tool result',
    category: 'planning',
    summary: 'The output of the tool comes back to the harness.',
    description:
      'The tool returns data, or an error. The harness formats it, often trimming large outputs so they do not flood the context window, and prepares a tool_result block that references the original tool_use id.',
    whyItMatters:
      'Errors are results too. Returning a clear error message lets the model recover (retry with different arguments) instead of the whole agent crashing.',
    example: {
      steps: [
        {
          kind: 'tool_result',
          from: 'tools',
          to: 'agent',
          label: '{ temp: 18, sunny }',
          note: 'Raw tool output returns to the harness.',
          payload: { temp_c: 18, condition: 'sunny', humidity: 0.41 },
        },
      ],
    },
  },
  {
    kind: 'observe',
    title: 'Observe (loop back)',
    category: 'planning',
    summary: 'The tool result is fed back to the model so it can decide what to do next.',
    description:
      'The harness appends the tool_result as a new user-role message and calls the model again. The model now "observes" the outcome of its action. This act → observe → think cycle repeats until the model gives a final answer.',
    whyItMatters:
      'This loop is what makes it an agent rather than a chatbot. The model can react to real results: retry on failure, go deeper, or change its plan.',
    example: {
      steps: [
        {
          kind: 'observe',
          from: 'agent',
          to: 'llm',
          label: 'tool_result → model',
          note: 'The result is appended to messages and the model is called again.',
          payload: {
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: 'toolu_01A',
                content: '{"temp_c":18,"condition":"sunny"}',
              },
            ],
          },
        },
      ],
    },
  },

  // ─── Memory & retrieval ───────────────────────────────────────
  {
    kind: 'memory_read',
    title: 'Memory read',
    category: 'memory',
    summary: 'Loading facts saved in earlier sessions, such as preferences or past decisions.',
    description:
      'Long-term memory lives outside the model, in a database or files. At the start of a session (or on demand via a tool) the harness loads relevant memories and injects them into the context.',
    whyItMatters:
      'Without it, every conversation starts from zero. Memory is what lets an agent remember that you prefer window seats or that your project uses pnpm.',
    example: {
      steps: [
        {
          kind: 'memory_read',
          from: 'agent',
          to: 'memory',
          label: 'load profile(user_42)',
          note: 'Query the memory store.',
        },
        {
          kind: 'memory_read',
          from: 'memory',
          to: 'agent',
          label: '3 memories',
          note: 'Memories are returned and added to the context.',
          payload: ['Prefers window seats', 'Vegetarian', 'Budget traveller'],
        },
      ],
    },
  },
  {
    kind: 'memory_write',
    title: 'Memory write',
    category: 'memory',
    summary: 'Saving a new fact so future sessions can use it.',
    description:
      'When the agent learns something durable (a preference, a correction, a decision) it writes it to long-term memory, usually via a dedicated "remember" tool the model can call.',
    whyItMatters:
      'Deciding what is worth remembering is hard. Save too little and the agent forgets; save too much and memory fills with noise that distracts future runs.',
    example: {
      steps: [
        {
          kind: 'memory_write',
          from: 'agent',
          to: 'memory',
          label: 'save("prefers TAP")',
          note: 'Persist a new fact.',
          payload: { user: 'user_42', fact: 'Prefers flying TAP Air Portugal', source: 'trip-2026-10' },
        },
      ],
    },
  },
  {
    kind: 'retrieval',
    title: 'Retrieval (RAG)',
    category: 'memory',
    summary: 'Searching a document store for passages relevant to the question.',
    description:
      'Retrieval-Augmented Generation: the query is turned into an embedding (a vector), compared against pre-embedded document chunks, and the closest matches are returned. The agent adds those chunks to the context so the model can answer from real sources.',
    whyItMatters:
      'Models do not know your private documents and can hallucinate facts. RAG grounds answers in actual text and makes citations possible.',
    example: {
      steps: [
        {
          kind: 'retrieval',
          from: 'agent',
          to: 'memory',
          label: 'vector_search(q, k=3)',
          note: 'Embed the query and search the vector store.',
          payload: { query: 'Q2 churn rate', embedding: '[0.021, -0.113, 0.087, …]', top_k: 3 },
        },
        {
          kind: 'retrieval',
          from: 'memory',
          to: 'agent',
          label: '3 chunks (0.91, 0.87, 0.80)',
          note: 'The most similar chunks come back with similarity scores.',
          payload: [
            { source: 'q2-report.pdf#p4', score: 0.91, text: 'Churn fell to 3.1% in Q2…' },
            { source: 'q2-report.pdf#p5', score: 0.87, text: 'Enterprise churn remained flat…' },
            { source: 'board-notes.md', score: 0.8, text: 'Retention initiatives launched in April…' },
          ],
        },
      ],
    },
  },
  {
    kind: 'context_management',
    title: 'Context management',
    category: 'memory',
    summary: 'Keeping the context window (short-term memory) from overflowing.',
    description:
      'The context window is the model\'s working memory, and it has a hard limit. As a long task grows, the harness trims old tool outputs, summarises earlier turns, or moves details into long-term memory to make room.',
    whyItMatters:
      'Hit the limit and the request fails. Stuff it with noise and quality drops. Good context management is a big part of what separates reliable agents from flaky ones.',
    example: {
      steps: [
        {
          kind: 'context_management',
          from: 'agent',
          to: 'agent',
          label: 'compact: 92% → 40%',
          note: 'Old turns are summarised to free up space.',
          payload:
            'Replaced 14 earlier messages (48k tokens) with summary:\n"User asked to fix failing date tests. Found bug in parseDate (month off-by-one). Fixed and tests pass. Now working on timezone handling."',
        },
      ],
    },
  },
]

export const CONCEPT_BY_KIND = Object.fromEntries(CONCEPTS.map((c) => [c.kind, c])) as Record<
  ActionKind,
  Concept
>
