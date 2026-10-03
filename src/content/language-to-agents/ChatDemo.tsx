import { useEffect, useRef, useState } from 'react'

const SYSTEM = 'You are a concise travel assistant.'

const TURNS = [
  { user: 'What is the capital of Ethiopia?', reply: 'The capital of Ethiopia is Addis Ababa.' },
  {
    user: 'How high is it?',
    reply:
      'Addis Ababa sits at about 2,355 meters (7,700 ft) above sea level, which makes it one of the highest capital cities in the world.',
  },
]

type Role = 'system' | 'user' | 'assistant'
interface Msg {
  role: Role
  text: string
}

interface State {
  system: boolean
  messages: Msg[]
  input: string
  pressing: boolean
  thinking: boolean
  /** Index into messages of the reply currently streaming. */
  streaming: number | null
  request: Msg[]
  calls: number
  done: boolean
}

const EMPTY: State = {
  system: false,
  messages: [],
  input: '',
  pressing: false,
  thinking: false,
  streaming: null,
  request: [],
  calls: 0,
  done: false,
}

/** The finished conversation, shown directly when motion is reduced. */
function finalState(): State {
  const messages = TURNS.flatMap((t) => [
    { role: 'user' as const, text: t.user },
    { role: 'assistant' as const, text: t.reply },
  ])
  return {
    ...EMPTY,
    system: true,
    messages,
    request: [{ role: 'system', text: SYSTEM }, ...messages.slice(0, -1)],
    calls: TURNS.length,
    done: true,
  }
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ChatDemo() {
  const [state, setState] = useState<State>(() => (reducedMotion() ? finalState() : EMPTY))
  const [run, setRun] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Start the first run when the demo scrolls into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setRun((r) => (r === 0 ? 1 : r))
        io.disconnect()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    // With reduced motion the finished conversation is shown from the start.
    if (run === 0 || reducedMotion()) return
    let cancelled = false
    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => setTimeout(() => (cancelled ? reject() : resolve()), ms))
    const update = (patch: Partial<State> | ((s: State) => Partial<State>)) =>
      setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))

    const play = async () => {
      setState(EMPTY)
      await sleep(500)
      update({ system: true })
      await sleep(1400)

      for (const turn of TURNS) {
        // The user types, character by character.
        for (let i = 1; i <= turn.user.length; i++) {
          update({ input: turn.user.slice(0, i) })
          await sleep(35 + Math.random() * 55)
        }
        await sleep(450)

        // Enter: the message moves into the transcript and the whole history is sent.
        update({ pressing: true })
        await sleep(160)
        update((s) => {
          const messages = [...s.messages, { role: 'user' as const, text: turn.user }]
          return {
            pressing: false,
            input: '',
            messages,
            request: [{ role: 'system', text: SYSTEM }, ...messages],
            calls: s.calls + 1,
            thinking: true,
          }
        })
        await sleep(1100)

        // The model streams its reply a few characters at a time.
        update((s) => ({
          thinking: false,
          streaming: s.messages.length,
          messages: [...s.messages, { role: 'assistant', text: '' }],
        }))
        const words = turn.reply.split(/(\s+)/)
        let text = ''
        for (const w of words) {
          text += w
          const t = text
          update((s) => ({ messages: s.messages.map((m, i) => (i === s.streaming ? { ...m, text: t } : m)) }))
          await sleep(w.trim() ? 40 + Math.random() * 60 : 0)
        }
        update({ streaming: null })
        await sleep(1400)
      }
      update({ done: true })
    }

    play().catch(() => {
      // Cancelled by a replay or unmount.
    })
    return () => {
      cancelled = true
    }
  }, [run])

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [state.messages, state.thinking, state.system])

  return (
    <div className="chat-demo" ref={rootRef}>
      <div className="chat-window">
        <div className="chat-titlebar">
          <span className="chat-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Travel assistant</span>
        </div>

        <div className="chat-scroll" ref={scrollRef} aria-live="polite">
          {state.system && (
            <div className="chat-system">
              <span className="chat-system-label">System prompt · added by the app, hidden from the user</span>
              {SYSTEM}
            </div>
          )}
          {state.messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="chat-user">
                {m.text}
              </div>
            ) : (
              <div key={i} className="chat-assistant">
                <span className="chat-avatar" aria-hidden="true" />
                <p>
                  {m.text}
                  {state.streaming === i && <span className="chat-cursor" />}
                </p>
              </div>
            ),
          )}
          {state.thinking && (
            <div className="chat-assistant">
              <span className="chat-avatar pulsing" aria-hidden="true" />
              <span className="chat-thinking" aria-label="Generating">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        <div className={`chat-input ${state.pressing ? 'pressing' : ''}`}>
          <span className={state.input ? '' : 'placeholder'}>
            {state.input || 'Message the assistant…'}
            {state.input && <span className="chat-caret" />}
          </span>
          <kbd className={state.pressing ? 'on' : ''}>Enter ⏎</kbd>
          <span className="chat-send" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M12 19V5M5 12l7-7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <aside className="chat-request" aria-label="What the model receives">
        <div className="chat-request-head">
          <span>Sent to the model</span>
          <span className="muted">{state.calls ? `call ${state.calls}` : 'no calls yet'}</span>
        </div>
        <ol key={state.calls}>
          {state.request.map((m, i) => (
            <li key={i} className={`req req-${m.role}`} style={{ animationDelay: `${i * 70}ms` }}>
              <span className="req-role">{m.role}</span>
              <span className="req-text">{m.text}</span>
            </li>
          ))}
        </ol>
        {state.calls > 1 && <p className="chat-request-note">Earlier turns are sent again with every call.</p>}
        {state.done && !reducedMotion() && (
          <button type="button" className="pill primary" onClick={() => setRun((r) => r + 1)}>
            Replay
          </button>
        )}
      </aside>
    </div>
  )
}
