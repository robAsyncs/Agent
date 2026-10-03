import { Fragment, type ReactNode } from 'react'

type Lang = 'python' | 'json' | 'bash' | 'text'

const PY_KEYWORDS = new Set([
  'import', 'from', 'as', 'def', 'class', 'return', 'for', 'in', 'if', 'else', 'elif', 'while', 'with',
  'try', 'except', 'raise', 'break', 'continue', 'pass', 'and', 'or', 'not', 'is', 'lambda', 'async', 'await',
  'True', 'False', 'None',
])

/** One regex per language; each alternative is classified by which group matched. */
const PATTERNS: Record<Exclude<Lang, 'text'>, RegExp> = {
  python: /(#[^\n]*)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g,
  json: /("(?:\\.|[^"\\])*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)/g,
  bash: /(#[^\n]*)|("(?:\\.|[^"\\])*"|'[^']*')|(\s-{1,2}[A-Za-z][\w-]*)|(\$[A-Z_]+)/g,
}

function highlight(code: string, lang: Lang) {
  if (lang === 'text') return code
  const re = PATTERNS[lang]
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  re.lastIndex = 0
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    let cls = ''
    if (lang === 'python') {
      if (m[1]) cls = 'api-c'
      else if (m[2]) cls = 'api-s'
      else if (m[3]) cls = 'api-n'
      else if (m[4]) cls = PY_KEYWORDS.has(m[4]) ? 'api-k' : /^[A-Z]/.test(m[4]) ? 'api-t' : ''
    } else if (lang === 'json') {
      if (m[1]) cls = m[2] ? 'api-p' : 'api-s'
      else if (m[3]) cls = 'api-n'
      else if (m[4]) cls = 'api-k'
    } else {
      if (m[1]) cls = 'api-c'
      else if (m[2]) cls = 'api-s'
      else if (m[3]) cls = 'api-k'
      else if (m[4]) cls = 'api-p'
    }
    out.push(cls ? <span key={m.index} className={cls}>{m[0]}</span> : <Fragment key={m.index}>{m[0]}</Fragment>)
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

/** A titled, lightly highlighted code block. */
export function Code({ code, lang = 'text', title }: { code: string; lang?: Lang; title?: string }) {
  return (
    <div className="api-code">
      {title && (
        <div className="api-code-head">
          <span>{title}</span>
          {lang !== 'text' && <span className="api-code-lang">{lang}</span>}
        </div>
      )}
      <pre>
        <code>{highlight(code.trim(), lang)}</code>
      </pre>
    </div>
  )
}
