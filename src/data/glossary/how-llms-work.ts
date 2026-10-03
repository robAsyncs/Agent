import type { GlossaryEntry } from './types'

/** Terms introduced in Topic 2. */
export const HOW_LLMS_WORK_TERMS = {
  bpe: {
    term: 'Byte-pair encoding (BPE)',
    definition:
      'A tokenizer training method: start from single characters or bytes and repeatedly merge the most frequent adjacent pair into a new token.',
  },
  logits: {
    term: 'Logits',
    definition:
      'The raw score the model outputs for every token in its vocabulary. Softmax turns them into probabilities.',
  },
  softmax: {
    term: 'Softmax',
    definition:
      'Converts a list of scores into probabilities that add up to 1: exponentiate each score, then divide by the sum.',
  },
  'lost-in-the-middle': {
    term: 'Lost in the middle',
    definition:
      'Models tend to use information at the start and end of a long context more reliably than information buried in the middle.',
  },
  pretraining: {
    term: 'Pretraining',
    definition:
      'The first and most expensive training stage: next-token prediction over trillions of tokens of general text. It produces a base model.',
  },
  'fine-tuning': {
    term: 'Fine-tuning',
    definition:
      'Continuing to train an already trained model on a smaller, targeted dataset to change its behavior or specialize it.',
  },
  'reward-model': {
    term: 'Reward model',
    definition:
      'A model trained on human preference comparisons to score responses. RLHF optimizes the LLM to get high scores from it.',
  },
  dpo: {
    term: 'DPO',
    definition:
      'Direct Preference Optimization: trains on preference pairs directly with a simple loss, skipping the separate reward model and RL loop.',
  },
  'chat-template': {
    term: 'Chat template',
    definition:
      'The format, with special tokens, that turns a list of role-tagged messages into the single token sequence the model actually reads.',
    topic: 'llm-apis',
  },
  temperature: {
    term: 'Temperature',
    definition:
      'Divides the logits before softmax. Below 1 makes the top tokens more likely; above 1 flattens the distribution toward randomness.',
    topic: 'llm-apis',
  },
  'top-p': {
    term: 'Top-p (nucleus sampling)',
    definition:
      'Sample only from the smallest set of tokens whose probabilities add up to p, cutting off the unlikely tail.',
    topic: 'llm-apis',
  },
  'max-tokens': {
    term: 'Max tokens',
    definition:
      'A hard limit on how many tokens the model may generate. If it is reached, the response stops mid-thought.',
    topic: 'llm-apis',
  },
  hallucination: {
    term: 'Hallucination',
    definition:
      'A fluent, confident statement that is false or unsupported, produced because the model generates plausible text rather than checking facts.',
    topic: 'memory-and-rag',
  },
  'knowledge-cutoff': {
    term: 'Knowledge cutoff',
    definition:
      'The date the training data ends. The model knows nothing after it unless the information is put in the context, for example by a search tool.',
    topic: 'tool-use',
  },
  'chain-of-thought': {
    term: 'Chain of thought',
    definition:
      'Having the model write out intermediate reasoning steps before the answer. Each step is extra computation the next tokens can build on.',
    topic: 'llm-apis',
  },
  'reasoning-model': {
    term: 'Reasoning model',
    definition:
      'A model trained, usually with reinforcement learning, to think at length before answering. Also called extended thinking. It trades tokens and time for accuracy.',
  },
  'open-weight': {
    term: 'Open-weight model',
    definition:
      'A model whose trained weights are published so anyone can download and run it. The training data and code are usually not released.',
  },
} satisfies Record<string, GlossaryEntry>
