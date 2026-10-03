import { HowLlmsWorkArticle } from '../../content/how-llms-work/Article'
import type { Topic } from '../../types'

export const howLlmsWork: Topic = {
  id: 'how-llms-work',
  number: 2,
  title: 'How Large Language Models Work',
  group: 'foundations',
  summary: 'Build an accurate mental model of what the model is and isn\'t doing.',
  sections: [],
  article: HowLlmsWorkArticle,
  sources: [
    { title: 'Andrej Karpathy, "Intro to Large Language Models" (video)', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
    { title: 'Andrej Karpathy, "Deep Dive into LLMs like ChatGPT" (video)', url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI' },
    { title: '3Blue1Brown, "Neural Networks" series', url: 'https://www.3blue1brown.com/topics/neural-networks' },
    { title: 'Sennrich et al., "Neural Machine Translation of Rare Words with Subword Units" (2016)', url: 'https://arxiv.org/abs/1508.07909' },
    { title: 'Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023)', url: 'https://arxiv.org/abs/2307.03172' },
    { title: 'Ouyang et al., "Training language models to follow instructions with human feedback" (2022)', url: 'https://arxiv.org/abs/2203.02155' },
    { title: 'Rafailov et al., "Direct Preference Optimization" (2023)', url: 'https://arxiv.org/abs/2305.18290' },
    { title: 'Bai et al., "Constitutional AI: Harmlessness from AI Feedback" (2022)', url: 'https://arxiv.org/abs/2212.08073' },
    { title: 'Holtzman et al., "The Curious Case of Neural Text Degeneration" (2019)', url: 'https://arxiv.org/abs/1904.09751' },
    { title: 'He et al., "Defeating Nondeterminism in LLM Inference" (Thinking Machines, 2025)', url: 'https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/' },
    { title: 'Kalai et al., "Why Language Models Hallucinate" (2025)', url: 'https://arxiv.org/abs/2509.04664' },
    { title: 'Mirzadeh et al., "GSM-Symbolic" (2024)', url: 'https://arxiv.org/abs/2410.05229' },
    { title: 'Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022)', url: 'https://arxiv.org/abs/2201.11903' },
    { title: 'DeepSeek-AI, "DeepSeek-R1" (2025)', url: 'https://arxiv.org/abs/2501.12948' },
  ],
  project: 'Explain to a friend, without notes, why an LLM can confidently state something false.',
  concepts: ['llm_request', 'reasoning', 'context_management'],
}
