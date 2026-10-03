/** Short definitions shown in popovers when a highlighted term is clicked. */
export interface GlossaryEntry {
  term: string
  definition: string
  /** Topic id with more detail, shown as a link in the popover. */
  topic?: string
}

export const GLOSSARY = {
  syntax: {
    term: 'Syntax',
    definition: 'The rules for how words combine into phrases and sentences, independent of what they mean.',
  },
  semantics: {
    term: 'Semantics',
    definition: 'What words and sentences mean: the literal content a sentence expresses.',
  },
  pragmatics: {
    term: 'Pragmatics',
    definition:
      'What a speaker means in context, beyond the literal words. “Can you pass the salt?” is a request, not a question about ability.',
  },
  'next-token': {
    term: 'Next-token prediction',
    definition:
      'Given the text so far, output a probability for every possible next token. Generation is repeated prediction: pick one, append it, predict again.',
    topic: 'how-llms-work',
  },
  tokens: {
    term: 'Tokens',
    definition:
      'The units a model actually reads and writes: whole words, pieces of words or punctuation. A common English word is usually one token.',
    topic: 'how-llms-work',
  },
  'n-gram': {
    term: 'N-gram model',
    definition:
      'Predicts the next word from only the previous n−1 words, using counts from a corpus. A bigram model (n = 2) looks at one word.',
  },
  sparsity: {
    term: 'Sparsity problem',
    definition:
      'Most long word sequences never appear in any training corpus, so count-based models give them zero probability even when they are perfectly valid.',
  },
  'neural-lm': {
    term: 'Neural language model',
    definition:
      'A language model that uses a neural network instead of a count table, so it can generalize to word combinations it has never seen.',
  },
  embedding: {
    term: 'Embedding',
    definition:
      'A vector of numbers representing a word or text. Similar meanings end up close together, so meaning can be compared with math.',
    topic: 'memory-and-rag',
  },
  transformer: {
    term: 'Transformer',
    definition:
      'The neural network architecture behind modern LLMs (2017). It processes all tokens in parallel and relates them to each other with attention.',
  },
  attention: {
    term: 'Attention',
    definition:
      'Each token scores how relevant every other token is, then mixes in their information weighted by those scores.',
  },
  scale: {
    term: 'Scaling laws',
    definition:
      'Model loss falls predictably as parameters, training data and compute grow. This is why labs kept building larger models.',
  },
  'in-context': {
    term: 'In-context learning',
    definition:
      'Picking up a new task from instructions or a few examples in the prompt, with no change to the model’s weights.',
    topic: 'llm-apis',
  },
  'base-model': {
    term: 'Base model',
    definition:
      'A model after pretraining only. It continues text in the style of its training data instead of following instructions.',
    topic: 'how-llms-work',
  },
  sft: {
    term: 'Supervised fine-tuning',
    definition:
      'Further training a pretrained model on example instructions paired with good responses, so it behaves like an assistant.',
    topic: 'how-llms-work',
  },
  rlhf: {
    term: 'RLHF',
    definition:
      'Reinforcement learning from human feedback. People rank model outputs, a reward model learns their preferences, and the LLM is trained to score well on it.',
    topic: 'how-llms-work',
  },
  'conversation-format': {
    term: 'Conversation format',
    definition:
      'A request is a list of messages, each with a role: system (instructions from the app), user, or assistant.',
    topic: 'llm-apis',
  },
  'system-prompt': {
    term: 'System prompt',
    definition:
      'Instructions the app places at the start of every request. The user usually never sees them, but the model reads them on every call.',
    topic: 'llm-apis',
  },
  stateless: {
    term: 'Stateless',
    definition:
      'The model keeps nothing between calls. Each request must contain the whole conversation; “memory” in a chat is the app resending the history.',
    topic: 'llm-apis',
  },
  'context-window': {
    term: 'Context window',
    definition:
      'The maximum number of tokens a model can handle in one request, counting the system prompt, the history and its own reply.',
    topic: 'how-llms-work',
  },
  tools: {
    term: 'Tools',
    definition:
      'Functions the app offers the model, each with a name, a description and a JSON schema. The model asks to call one; the app runs it.',
    topic: 'tool-use',
  },
  harness: {
    term: 'Harness',
    definition:
      'The code around the model that runs the loop: calling the model, executing tools, managing history and deciding when to stop.',
    topic: 'agent-loop',
  },
  react: {
    term: 'ReAct',
    definition:
      'A pattern where the model alternates between reasoning about what to do and taking an action, using each result to plan the next step.',
    topic: 'agent-loop',
  },
  workflow: {
    term: 'Workflow',
    definition:
      'Code follows a path decided in advance and the model fills in individual steps. In an agent, the model chooses the steps itself.',
    topic: 'advanced-architectures',
  },
} satisfies Record<string, GlossaryEntry>

export type GlossaryId = keyof typeof GLOSSARY
