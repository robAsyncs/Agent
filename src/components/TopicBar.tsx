import { useEffect, useRef, useState, type RefObject } from 'react'

const NAV_HEIGHT = 56
const BAR_HEIGHT = 44

interface Props {
  /** e.g. "Topic 1" */
  label: string
  title: string
  /** The page title; the bar appears once it scrolls under the nav. */
  titleRef: RefObject<HTMLElement | null>
  /** Container whose `h2[data-section]` headings mark the sections. */
  bodyRef: RefObject<HTMLElement | null>
}

/** Sticky context bar for long topic pages: which topic, which section, how far along. */
export function TopicBar({ label, title, titleRef, bodyRef }: Props) {
  const [visible, setVisible] = useState(false)
  const [section, setSection] = useState<{ num?: string; title: string } | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const titleEl = titleRef.current
      setVisible(!!titleEl && titleEl.getBoundingClientRect().bottom < NAV_HEIGHT)

      // The current section is the last heading that has scrolled under the bars.
      const line = NAV_HEIGHT + BAR_HEIGHT + 24
      const headings = bodyRef.current?.querySelectorAll<HTMLElement>('h2[data-section]') ?? []
      let current: HTMLElement | undefined
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h
      }
      setSection((prev) => {
        const next = current ? { num: current.dataset.num, title: current.dataset.section! } : null
        return prev?.title === next?.title ? prev : next
      })

      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      progressRef.current?.style.setProperty('transform', `scaleX(${p})`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [titleRef, bodyRef])

  return (
    <div className={`topic-bar ${visible ? 'on' : ''}`} aria-hidden={!visible}>
      <div className="topic-bar-inner">
        <button
          type="button"
          className="topic-bar-title"
          tabIndex={visible ? 0 : -1}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
        >
          <span>{label}</span>
          <strong>{title}</strong>
        </button>
        {section && (
          <span key={section.title} className="topic-bar-section">
            {section.num && <span className="topic-bar-num">{section.num}</span>}
            {section.title}
          </span>
        )}
      </div>
      <div className="topic-bar-progress" ref={progressRef} />
    </div>
  )
}
