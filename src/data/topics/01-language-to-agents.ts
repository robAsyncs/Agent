import type { Topic } from '../../types'

export const languageToAgents: Topic = {
  id: 'language-to-agents',
  number: 1,
  title: 'From Language to Agents',
  group: 'foundations',
  summary: 'How we get from human language to software that can act on its own.',
  sections: [
    {
      title: 'What language is',
      points: [
        'A shared system of symbols for passing meaning between people',
        'Structure: words, grammar, and context working together',
        'The same sentence can mean different things in different contexts',
        'Written text as a record of how people explain, reason, and give instructions',
      ],
    },
    {
      title: 'What a language model is',
      points: [
        'A program that estimates how likely a sequence of words is',
        'Predicting the next word from the words that came before',
        'Early approaches: n-grams and statistical models',
        'Neural language models and word embeddings',
      ],
    },
    {
      title: 'Large language models',
      points: [
        'Transformers and attention: looking at the whole context at once',
        'Scale: billions of parameters trained on a large share of the written web',
        'Abilities that appear with scale: summarizing, translating, coding, reasoning',
        'Text in, text out: the model on its own cannot take actions',
      ],
    },
    {
      title: 'Chatbots',
      points: [
        'Turning a raw model into an assistant that follows instructions',
        'The conversation format: system, user, and assistant messages',
        'The whole conversation is sent again on every turn',
        'Limits: it can only reply, not look things up or do things',
      ],
    },
    {
      title: 'Agents',
      points: [
        'Giving the model tools it can ask to use',
        'The loop: think, act, observe, repeat',
        'The harness: the code around the model that runs tools and keeps state',
        'From answering questions to completing tasks',
      ],
    },
  ],
  sources: [],
  scenarios: ['weather'],
  concepts: ['user_prompt', 'final_response', 'tool_call', 'observe'],
}
