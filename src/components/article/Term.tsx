import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { GLOSSARY, type GlossaryEntry, type GlossaryId } from '../../data/glossary'
import { TOPIC_BY_ID } from '../../data/topics'

const WIDTH = 300
const GAP = 8
const EDGE = 12

/** A highlighted keyword. Clicking it opens a short definition from the glossary. */
export function Term({ id, children }: { id: GlossaryId; children?: ReactNode }) {
  const entry: GlossaryEntry = GLOSSARY[id]
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null)
  const termRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const popId = useId()

  // Keep the popover attached to the term while the page scrolls or resizes.
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const r = termRef.current!.getBoundingClientRect()
      const height = popRef.current?.offsetHeight ?? 160
      const above = r.bottom + GAP + height > window.innerHeight - EDGE && r.top - GAP - height > EDGE
      const width = Math.min(WIDTH, window.innerWidth - EDGE * 2)
      const left = Math.min(Math.max(r.left + r.width / 2 - width / 2, EDGE), window.innerWidth - width - EDGE)
      setPos({ top: above ? r.top - GAP - height : r.bottom + GAP, left, above })
    }
    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [open])

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node
      if (!termRef.current?.contains(t) && !popRef.current?.contains(t)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      termRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const topic = entry.topic ? TOPIC_BY_ID[entry.topic] : undefined

  return (
    <>
      <button
        ref={termRef}
        type="button"
        className={`term ${open ? 'open' : ''}`}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {children ?? entry.term}
      </button>
      {open &&
        createPortal(
          <div
            ref={popRef}
            id={popId}
            role="dialog"
            aria-label={entry.term}
            className={`term-pop ${pos?.above ? 'above' : ''}`}
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: Math.min(WIDTH, window.innerWidth - EDGE * 2),
            }}
          >
            <strong>{entry.term}</strong>
            <p>{entry.definition}</p>
            {topic && (
              <Link to={`/topics/${topic.id}`} onClick={() => setOpen(false)}>
                More in Topic {topic.number}: {topic.title} →
              </Link>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
