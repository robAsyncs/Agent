import type { ReactNode } from 'react'

/** Building blocks for long-form topic write-ups. */

export function ArticleSection({ n, title, children }: { n?: number; title: string; children: ReactNode }) {
  return (
    <section className="topic prose">
      <h2 data-section={title} data-num={n}>
        {n !== undefined && <span className="topic-num">{n}</span>}
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Figure({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="figure">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="callout">
      <span className="callout-label">{label}</span>
      {children}
    </aside>
  )
}
