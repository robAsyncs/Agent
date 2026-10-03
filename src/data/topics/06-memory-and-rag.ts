import type { Topic } from '../../types'

export const memoryAndRag: Topic = {
  id: 'memory-and-rag',
  number: 6,
  title: 'Memory and Retrieval (RAG)',
  group: 'agents',
  summary: 'Give agents access to more knowledge than fits in the context window.',
  sections: [
    {
      title: 'Types of memory',
      points: [
        'Short-term: the conversation and context window',
        'Long-term: stored facts, preferences, past interactions',
        'Working memory: scratchpads and notes during a task',
      ],
    },
    {
      title: 'Embeddings',
      points: [
        'What an embedding is (meaning as a list of numbers)',
        'Similarity search and cosine similarity',
        'Embedding models and choosing one',
      ],
    },
    {
      title: 'Vector databases',
      points: [
        'Chroma, pgvector, Pinecone, Qdrant',
        'Storing, indexing, and querying',
      ],
    },
    {
      title: 'Building a RAG pipeline',
      points: [
        'Loading documents',
        'Chunking strategies (size, overlap, semantic chunking)',
        'Retrieval and re-ranking',
        'Injecting retrieved context into prompts',
        'Hybrid search (keywords + embeddings)',
      ],
    },
    {
      title: 'Context management',
      points: [
        'Summarizing old conversation history',
        'Deciding what to keep, compress, or drop',
        'Agentic retrieval: letting the agent decide what to search for',
      ],
    },
  ],
  sources: [],
  project: 'A "chat with your documents" app that answers questions about a folder of PDFs and cites its sources.',
  scenarios: ['research', 'trip'],
  concepts: ['memory_read', 'memory_write', 'retrieval', 'context_management'],
}
