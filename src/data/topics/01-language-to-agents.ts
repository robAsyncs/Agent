import { LanguageToAgentsArticle } from '../../content/language-to-agents/Article'
import type { Topic } from '../../types'

export const languageToAgents: Topic = {
  id: 'language-to-agents',
  number: 1,
  title: 'From Language to Agents',
  group: 'foundations',
  summary: 'How we get from human language to software that can act on its own.',
  sections: [],
  article: LanguageToAgentsArticle,
  sources: [
    'Shannon, "A Mathematical Theory of Communication" (1948)',
    'Bengio et al., "A Neural Probabilistic Language Model" (2003)',
    'Mikolov et al., "Efficient Estimation of Word Representations in Vector Space" (2013)',
    'Vaswani et al., "Attention Is All You Need" (2017)',
    'Kaplan et al., "Scaling Laws for Neural Language Models" (2020)',
    'Brown et al., "Language Models are Few-Shot Learners" (2020)',
    'Ouyang et al., "Training language models to follow instructions with human feedback" (2022)',
    'Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2022)',
    'Anthropic, "Building Effective Agents" (2024)',
  ],
  scenarios: ['weather'],
  concepts: ['user_prompt', 'final_response', 'tool_call', 'observe'],
}
