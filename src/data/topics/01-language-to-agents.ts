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
    { title: 'Shannon, "A Mathematical Theory of Communication" (1948)', url: 'https://doi.org/10.1002/j.1538-7305.1948.tb01338.x' },
    { title: 'Bengio et al., "A Neural Probabilistic Language Model" (2003)', url: 'https://www.jmlr.org/papers/v3/bengio03a.html' },
    { title: 'Mikolov et al., "Efficient Estimation of Word Representations in Vector Space" (2013)', url: 'https://arxiv.org/abs/1301.3781' },
    { title: 'Vaswani et al., "Attention Is All You Need" (2017)', url: 'https://arxiv.org/abs/1706.03762' },
    { title: 'Kaplan et al., "Scaling Laws for Neural Language Models" (2020)', url: 'https://arxiv.org/abs/2001.08361' },
    { title: 'Brown et al., "Language Models are Few-Shot Learners" (2020)', url: 'https://arxiv.org/abs/2005.14165' },
    { title: 'Ouyang et al., "Training language models to follow instructions with human feedback" (2022)', url: 'https://arxiv.org/abs/2203.02155' },
    { title: 'Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2022)', url: 'https://arxiv.org/abs/2210.03629' },
    { title: 'Anthropic, "Building Effective Agents" (2024)', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
  ],
  scenarios: ['weather'],
  concepts: ['user_prompt', 'final_response', 'tool_call', 'observe'],
}
