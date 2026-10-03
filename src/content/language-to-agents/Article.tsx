import { ArticleSection, Callout, Figure } from '../../components/article/Article'
import { Payload } from '../../components/Payload'
import { AttentionDemo } from './AttentionDemo'
import { ChatVsAgentDemo } from './ChatVsAgentDemo'
import { AgentLoop, Ladder } from './Diagrams'
import { NextWordDemo } from './NextWordDemo'

const MESSAGES = {
  system: 'You are a concise travel assistant.',
  messages: [
    { role: 'user', content: 'What is the capital of Ethiopia?' },
    { role: 'assistant', content: 'Addis Ababa.' },
    { role: 'user', content: 'How high is it?' },
  ],
}

export function LanguageToAgentsArticle() {
  return (
    <>
      <section className="topic prose">
        <p className="prose-intro">
          When I started this project, I thought of an AI agent as a smarter chatbot. It turned out to be
          something more specific: a stack of ideas, where each layer adds exactly one capability to the
          layer below it. To understand agents, I had to start at the bottom, with language itself.
        </p>
        <Figure caption="Each layer builds on the one before it. This page walks up the stack.">
          <Ladder />
        </Figure>
      </section>

      <ArticleSection n={1} title="What language is">
        <p>
          Language is a code for moving meaning from one mind to another. The symbols are arbitrary (nothing
          about the letters <em>c-a-t</em> resembles a cat), but they are shared, and they come with rules.
          Linguists split those rules into layers: <strong>syntax</strong> (how words combine),{' '}
          <strong>semantics</strong> (what the combinations mean) and <strong>pragmatics</strong> (what the
          speaker means in this particular context).
        </p>
        <p>
          The layers interact, which is why language is ambiguous. “I saw her duck” has two valid parses, and
          only context tells you whether a bird or a movement is involved. Humans resolve this constantly
          without noticing. A program has to resolve it from the text alone.
        </p>
        <p>
          Two properties of written language make everything else on this page possible. First, to a
          computer, text is just a <strong>sequence of discrete symbols</strong>, which means it can be
          counted and modeled statistically. Second, text is a <strong>by-product of human thinking</strong>:
          the written record contains facts, arguments, instructions, code and step-by-step explanations. A
          system that learns to predict that record well has to absorb some of the structure behind it.
        </p>
      </ArticleSection>

      <ArticleSection n={2} title="What a language model is">
        <p>
          A language model assigns a probability to a sequence of words. By the chain rule of probability,
          that is the same as predicting each word from the ones before it:
        </p>
        <p className="equation">
          P(w<sub>1</sub>, …, w<sub>n</sub>) = ∏ P(w<sub>i</sub> | w<sub>1</sub>, …, w<sub>i−1</sub>)
        </p>
        <p>
          So a language model is, at its core, a <strong>next-word predictor</strong>. (Real models predict{' '}
          <em>tokens</em>, which are words or pieces of words. Topic 2 covers tokenization.) Generating text
          is just running that prediction in a loop: pick a next word from the distribution, append it, and
          predict again.
        </p>
        <p>
          The oldest approach is the <strong>n-gram model</strong>: count how often each word follows the
          previous <em>n</em>−1 words in a corpus and turn the counts into probabilities. Claude Shannon
          generated English this way by hand in 1948. Below is a bigram model (n = 2) that builds its table
          from a few sentences when the page loads. Try sampling ten words at a time and watch it drift.
        </p>
        <Figure>
          <NextWordDemo />
        </Figure>
        <p>
          The drift shows the core weakness of n-grams: the model only sees one word of context, so it has no
          idea what the sentence is about. Using longer n-grams helps a little, but most long word sequences
          never appear in any corpus, so their counts are zero. This is the <strong>sparsity problem</strong>.
        </p>
        <p>
          <strong>Neural language models</strong> (Bengio et al., 2003) replaced the count table with a
          neural network that maps each word to a learned vector, an <strong>embedding</strong>. Words used
          in similar contexts end up with similar vectors, so the model can generalize to word combinations it
          has never seen. Word2vec (2013) made embeddings famous with results like{' '}
          <code>king − man + woman ≈ queen</code>. Recurrent networks (RNNs, LSTMs) then extended the
          context to whole sentences, but they read one word at a time and struggled to carry information
          across long passages.
        </p>
      </ArticleSection>

      <ArticleSection n={3} title="Large language models">
        <p>
          The <strong>transformer</strong> (Vaswani et al., 2017) removed the one-word-at-a-time bottleneck.
          Its key mechanism, <strong>attention</strong>, lets every token look directly at every other token
          in the context and learn how much each one matters. Because all positions are processed in
          parallel, transformers also train efficiently on modern GPUs.
        </p>
        <p>
          A classic example of why attention matters: in the sentence below, the word <em>it</em> refers to
          a different noun depending on the last word. To predict well, the model has to work out which one.
        </p>
        <Figure>
          <AttentionDemo />
        </Figure>
        <p>
          The other ingredient is <strong>scale</strong>. Kaplan et al. (2020) showed that a transformer's
          prediction loss falls smoothly and predictably as you increase parameters, data and compute.
          GPT-3 (2020), with 175 billion parameters, showed a striking side effect: it could do new tasks
          from a few examples in the prompt, with no retraining. This is called{' '}
          <strong>in-context learning</strong>. Summarizing, translating, writing code and multi-step
          reasoning all emerged from the same next-token objective.
        </p>
        <Callout label="The important limit">
          <p>
            However capable it is, an LLM is still a function from text to text. It has no internet access,
            no memory between calls, and its knowledge stops at its training cutoff. It cannot <em>do</em>{' '}
            anything; it can only say what should be done. The next two layers are about working around
            exactly this.
          </p>
        </Callout>
      </ArticleSection>

      <ArticleSection n={4} title="Chatbots">
        <p>
          A raw, pretrained model (a <strong>base model</strong>) continues text; it does not answer it. Ask
          a base model “What is the capital of France?” and it may continue with three more quiz questions,
          because that is a likely continuation on the web. To get an assistant, the model is fine-tuned on
          examples of instructions and good responses (<strong>supervised fine-tuning</strong>), then
          further trained on human preference ratings (<strong>RLHF</strong>). In the InstructGPT paper
          (Ouyang et al., 2022), people preferred the outputs of a 1.3-billion-parameter tuned model over
          those of the 175-billion-parameter GPT-3. ChatGPT, released later that year, used the same recipe.
        </p>
        <p>
          A chatbot also needs a <strong>conversation format</strong>. Every chat API takes a list of
          messages, each with a role:
        </p>
        <Callout label="Example: a chat request">
          <Payload value={MESSAGES} />
          <p>
            The model only answers “How high is it?” correctly because the earlier turns are in the request.
          </p>
        </Callout>
        <p>
          The model itself is <strong>stateless</strong>. The feeling of memory in a chat comes from the
          application resending the entire conversation on every turn. That is why long chats get slower and
          more expensive, and why they eventually hit the <strong>context window</strong> limit.
        </p>
        <p>
          A chatbot is still bounded by what the model knows and what fits in the conversation. Ask it about
          something live, like this afternoon's weather, and the best it can do is hedge.
        </p>
      </ArticleSection>

      <ArticleSection n={5} title="Agents">
        <p>
          An agent closes the gap between saying and doing. The application gives the model a list of{' '}
          <strong>tools</strong>, each with a name, a description and a JSON schema for its arguments. When
          the model decides a tool would help, it replies with a structured request instead of prose.{' '}
          <em>Your code</em> runs the tool, appends the result to the conversation, and calls the model
          again. This repeats until the model decides it is done.
        </p>
        <Figure caption="The agent loop. The model decides; the harness acts.">
          <AgentLoop />
        </Figure>
        <p>
          Here is the same question sent to a chatbot and to an agent with one weather tool. Step through the
          agent to see each model call and tool result.
        </p>
        <Figure>
          <ChatVsAgentDemo />
        </Figure>
        <p>
          The code around the model is called the <strong>harness</strong>. It runs the tools, keeps the
          message history, enforces permissions and stops the loop when the model gives a final answer or a
          step limit is reached. The model never touches the outside world directly: it only proposes
          actions, and the harness decides whether to carry them out. That split is what makes agents both
          useful and controllable.
        </p>
        <p>
          The defining feature of an agent is that <strong>the model chooses the steps</strong>. Anthropic's
          “Building Effective Agents” draws the line this way: in a <em>workflow</em>, code follows a path
          that was decided in advance; in an <em>agent</em>, the model decides which tool to call next based
          on what it has seen so far. The ReAct pattern (Yao et al., 2022), which interleaves reasoning and
          actions, is the most common way to structure this loop.
        </p>
        <p>
          The rest of this project takes each layer apart. Topic 2 looks inside the model, Topic 3 covers
          calling it through an API, and Topics 4 and 5 build the tool-use loop from scratch.
        </p>
      </ArticleSection>
    </>
  )
}
