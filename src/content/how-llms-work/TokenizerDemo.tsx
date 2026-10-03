import { useMemo, useState } from 'react'

/** Training text for the tokenizer. Real tokenizers learn from terabytes; this is a paragraph. */
const CORPUS = `
the model reads the text as tokens and the tokens are numbers the model can work with
the tokenizer learns which pieces of text appear together most often and merges them
common words become single tokens while rare words are split into smaller pieces
the model predicts the next token then the next token after that until the answer is done
a token can be a whole word a piece of a word a space or a single character
every request is counted in tokens so the length of the text decides the cost and the limits
the context window holds the tokens the model can read at once including the answer it writes
language models learn the patterns of language from the text they are trained on
`

/** GPT-style pre-tokenization: words keep their leading space. */
function pretokenize(text: string): string[] {
  return text.match(/ ?[A-Za-z]+| ?\d+| ?[^\sA-Za-z\d]+|\s+/g) ?? []
}

/** Learn merge rules with byte-pair encoding: repeatedly merge the most frequent adjacent pair. */
function learnMerges(corpus: string, maxMerges: number): [string, string][] {
  const counts = new Map<string, number>()
  for (const w of pretokenize(corpus.replace(/\s+/g, ' ').trim())) counts.set(w, (counts.get(w) ?? 0) + 1)
  let words = [...counts].map(([w, n]) => ({ parts: [...w], n }))
  const merges: [string, string][] = []

  for (let m = 0; m < maxMerges; m++) {
    const pairs = new Map<string, number>()
    for (const { parts, n } of words) {
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i] + '\u0000' + parts[i + 1]
        pairs.set(key, (pairs.get(key) ?? 0) + n)
      }
    }
    let best = ''
    let bestCount = 1
    for (const [key, n] of pairs) if (n > bestCount) [best, bestCount] = [key, n]
    if (!best) break
    const [a, b] = best.split('\u0000')
    merges.push([a, b])
    words = words.map(({ parts, n }) => {
      const next: string[] = []
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === a && parts[i + 1] === b) {
          next.push(a + b)
          i++
        } else next.push(parts[i])
      }
      return { parts: next, n }
    })
  }
  return merges
}

/** Apply the first `k` merges, lowest rank first, the way a trained BPE tokenizer encodes text. */
function encode(text: string, merges: [string, string][], k: number): string[] {
  const rank = new Map(merges.slice(0, k).map(([a, b], i) => [a + '\u0000' + b, i]))
  return pretokenize(text).flatMap((word) => {
    const parts = [...word]
    for (;;) {
      let bestIdx = -1
      let bestRank = Infinity
      for (let i = 0; i < parts.length - 1; i++) {
        const r = rank.get(parts[i] + '\u0000' + parts[i + 1])
        if (r !== undefined && r < bestRank) [bestIdx, bestRank] = [i, r]
      }
      if (bestIdx < 0) return parts
      parts.splice(bestIdx, 2, parts[bestIdx] + parts[bestIdx + 1])
    }
  })
}

const MERGES = learnMerges(CORPUS, 200)
const DEFAULT_TEXT = 'The tokenizer splits unfamiliar words like Brobdingnagian into smaller pieces.'

const show = (t: string) => t.replace(/ /g, '·')

export function TokenizerDemo() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [k, setK] = useState(MERGES.length)
  const tokens = useMemo(() => encode(text, MERGES, k), [text, k])
  const chars = [...text].length
  const recent = MERGES.slice(Math.max(0, k - 4), k)

  return (
    <div className="demo">
      <label className="llm-field">
        <span className="small muted">Type anything</span>
        <input value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} maxLength={160} />
      </label>

      <p className="llm-tokens" aria-label={`${tokens.length} tokens`}>
        {tokens.map((t, i) => (
          <span key={i} className={`llm-token c${i % 5}`}>
            {show(t)}
          </span>
        ))}
      </p>

      <div className="llm-stats">
        <span>
          <strong>{tokens.length}</strong> tokens
        </span>
        <span>
          <strong>{chars}</strong> characters
        </span>
        <span>
          <strong>{tokens.length ? (chars / tokens.length).toFixed(1) : '0'}</strong> chars / token
        </span>
      </div>

      <div className="demo-controls">
        <label className="slider llm-slider-wide">
          Merges learned <output>{k}</output>
          <input type="range" min={0} max={MERGES.length} value={k} onChange={(e) => setK(Number(e.target.value))} />
        </label>
      </div>
      {recent.length > 0 && (
        <p className="demo-note llm-merges">
          Latest merges:
          {recent.map(([a, b], i) => (
            <code key={i} className="llm-merge">
              {show(a)} + {show(b)} → {show(a + b)}
            </code>
          ))}
        </p>
      )}
      <p className="demo-note">
        A real byte-pair encoding tokenizer, trained in your browser on eight sentences. Production tokenizers
        learn their merges from huge corpora and end up with vocabularies of roughly 30,000 to 200,000 tokens.
        A dot (·) marks a leading space, which is part of the token.
      </p>
    </div>
  )
}
