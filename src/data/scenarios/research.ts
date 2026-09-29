import type { Scenario } from '../../types'
import { ctx } from './ctx'

const SYSTEM =
  'You answer questions about company documents. Only use information from search_docs results. Cite sources as [source]. If the documents do not contain the answer, say so.'

const QUESTION = 'What did our Q2 report say about churn, and how does it compare to Q1?'

const Q2_CHUNKS = [
  { source: 'q2-report.pdf#p4', score: 0.91, text: 'Monthly churn fell to 3.1% in Q2, driven by the new onboarding flow.' },
  { source: 'q2-report.pdf#p5', score: 0.86, text: 'Enterprise churn remained flat at 1.2%; SMB churn improved most.' },
  { source: 'board-notes-june.md', score: 0.79, text: 'Retention initiatives (onboarding v2, in-app tips) launched in April.' },
]

const Q1_CHUNKS = [
  { source: 'q1-report.pdf#p3', score: 0.93, text: 'Monthly churn was 4.4% in Q1, up from 4.0% in Q4.' },
  { source: 'q1-report.pdf#p7', score: 0.81, text: 'Top churn reason: users not completing setup in the first week.' },
]

const ANSWER =
  'Churn improved from 4.4% in Q1 [q1-report p3] to 3.1% in Q2 [q2-report p4], a drop of 1.3 points.\n\nQ1\'s main churn driver was users not finishing setup [q1-report p7]; the Q2 report credits the new onboarding flow launched in April [q2-report p4][board-notes-june]. Enterprise churn stayed flat at 1.2% [q2-report p5].'

export const research: Scenario = {
  id: 'research',
  title: 'Research with RAG',
  tagline: 'Retrieves passages from a document store and answers with citations.',
  steps: [
    {
      kind: 'system_prompt',
      from: 'agent',
      to: 'llm',
      label: 'inject system prompt',
      note: 'The system prompt restricts the model to retrieved sources. This reduces hallucination.',
      payload: { system: SYSTEM },
      context: ctx('system', 'System prompt', SYSTEM),
    },
    {
      kind: 'user_prompt',
      from: 'user',
      to: 'agent',
      label: '"Q2 churn vs Q1?"',
      note: 'The answer lives in private documents the model has never seen.',
      payload: { role: 'user', content: QUESTION },
      context: ctx('user', '"Q2 churn vs Q1?"', QUESTION),
    },
    {
      kind: 'llm_request',
      from: 'agent',
      to: 'llm',
      label: 'messages.create()',
      note: 'One tool is available: search_docs(query, top_k).',
      payload: {
        model: 'claude-sonnet-5-5',
        tools: [
          {
            name: 'search_docs',
            description: 'Semantic search over company documents. Returns the most relevant passages with sources.',
            input_schema: { type: 'object', properties: { query: { type: 'string' }, top_k: { type: 'integer' } } },
          },
        ],
      },
    },
    {
      kind: 'planning',
      from: 'llm',
      to: 'llm',
      label: 'plan: 2 searches',
      note: 'A comparison needs two sets of facts, so the model plans two separate, focused searches.',
      payload: '1. Search Q2 churn figures\n2. Search Q1 churn figures\n3. Compare and cite both',
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: search_docs',
      note: 'The model writes its own search query. It is often better phrased than the user\'s question.',
      payload: { type: 'tool_use', id: 'toolu_01', name: 'search_docs', input: { query: 'Q2 churn rate retention', top_k: 3 } },
      context: ctx('assistant', 'tool_use search_docs (Q2)', { query: 'Q2 churn rate retention', top_k: 3 }),
    },
    {
      kind: 'retrieval',
      from: 'agent',
      to: 'memory',
      label: 'embed + vector_search',
      note: 'The query is converted to an embedding vector and compared with every stored chunk by cosine similarity.',
      payload: { query: 'Q2 churn rate retention', embedding: '[0.021, -0.113, 0.087, … 1536 dims]', top_k: 3 },
    },
    {
      kind: 'retrieval',
      from: 'memory',
      to: 'agent',
      label: '3 chunks (0.91, 0.86, 0.79)',
      note: 'The closest chunks come back with similarity scores and source references.',
      payload: Q2_CHUNKS,
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'chunks → model',
      note: 'The retrieved text is now in the context window. The model will read it as if the user had pasted it.',
      context: ctx('tool_result', 'Q2 chunks (3)', Q2_CHUNKS),
    },
    {
      kind: 'tool_selection',
      from: 'llm',
      to: 'agent',
      label: 'tool_use: search_docs',
      note: 'Step 2 of the plan: get the Q1 numbers for the comparison.',
      payload: { type: 'tool_use', id: 'toolu_02', name: 'search_docs', input: { query: 'Q1 churn rate', top_k: 3 } },
      context: ctx('assistant', 'tool_use search_docs (Q1)', { query: 'Q1 churn rate', top_k: 3 }),
    },
    {
      kind: 'retrieval',
      from: 'agent',
      to: 'memory',
      label: 'embed + vector_search',
      note: 'The same retrieval pipeline runs with a different query.',
      payload: { query: 'Q1 churn rate', top_k: 3 },
    },
    {
      kind: 'retrieval',
      from: 'memory',
      to: 'agent',
      label: '2 chunks (0.93, 0.81)',
      note: 'Only two chunks passed the similarity threshold.',
      payload: Q1_CHUNKS,
    },
    {
      kind: 'observe',
      from: 'agent',
      to: 'llm',
      label: 'chunks → model',
      note: 'Now the context holds evidence for both quarters.',
      context: ctx('tool_result', 'Q1 chunks (2)', Q1_CHUNKS),
    },
    {
      kind: 'reasoning',
      from: 'llm',
      to: 'llm',
      label: 'synthesise',
      note: 'The model combines facts from different documents, which a single search could not do.',
      payload:
        'Q1: 4.4% [q1 p3] → Q2: 3.1% [q2 p4] = −1.3pp. Q1 top reason was incomplete setup [q1 p7]; Q2 credits onboarding v2 [q2 p4, board-notes]. Nice causal story, and it is supported by the sources.',
    },
    {
      kind: 'final_response',
      from: 'llm',
      to: 'agent',
      label: 'stop_reason: end_turn',
      note: 'The answer includes inline citations the UI can turn into links.',
      context: ctx('assistant', 'cited answer', ANSWER),
    },
    {
      kind: 'final_response',
      from: 'agent',
      to: 'user',
      label: 'answer + 4 citations',
      note: 'Every claim traces back to a retrieved chunk. This is the main value of RAG.',
      payload: ANSWER,
    },
  ],
}
