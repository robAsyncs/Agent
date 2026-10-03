import type { Topic } from '../../types'

export const howLlmsWork: Topic = {
  id: 'how-llms-work',
  number: 2,
  title: 'How Large Language Models Work',
  group: 'foundations',
  summary: 'Build an accurate mental model of what the model is and isn\'t doing.',
  sections: [
    {
      title: 'The basics',
      points: [
        'Next-token prediction: what "generating text" actually means',
        'Tokens and tokenization, and why they affect cost and limits',
        'Context windows and what happens when you exceed them',
      ],
    },
    {
      title: 'How models are made',
      points: [
        'Pretraining vs. fine-tuning vs. instruction tuning vs. RLHF',
        'Base models vs. chat models',
      ],
    },
    {
      title: 'Generation settings',
      points: [
        'Temperature, top-p, and max tokens',
        'Determinism and why the same prompt can give different answers',
      ],
    },
    {
      title: 'Strengths and limitations',
      points: [
        'Hallucination and why it happens',
        'Knowledge cutoffs',
        'Reasoning abilities and their limits',
        'Extended thinking / reasoning models',
      ],
    },
    {
      title: 'The model landscape',
      points: [
        'Major providers and model families',
        'Choosing between large, capable models and small, fast, cheap ones',
        'Open-weight models vs. API-only models',
      ],
    },
  ],
  sources: [
    { title: 'Andrej Karpathy, "Intro to Large Language Models" (video)', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
    { title: 'Andrej Karpathy, "Deep Dive into LLMs like ChatGPT" (video)', url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI' },
    { title: '3Blue1Brown, "Neural Networks" series', url: 'https://www.3blue1brown.com/topics/neural-networks' },
  ],
  project: 'Explain to a friend, without notes, why an LLM can confidently state something false.',
  concepts: ['llm_request', 'reasoning', 'context_management'],
}
