import { useCallback, useEffect, useState } from 'react'

/** Debugger-style playback over `length` steps. index -1 means "nothing revealed yet". */
export function usePlayback(length: number) {
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const atEnd = index >= length - 1
  // Playback stops by itself once the last step is reached.
  const isPlaying = playing && !atEnd

  useEffect(() => {
    if (!isPlaying) return
    const id = setTimeout(() => setIndex((i) => i + 1), 1600 / speed)
    return () => clearTimeout(id)
  }, [isPlaying, index, speed])

  // Manual stepping pauses playback, like a debugger.
  const next = useCallback(() => {
    setPlaying(false)
    setIndex((i) => Math.min(i + 1, length - 1))
  }, [length])
  const prev = useCallback(() => {
    setPlaying(false)
    setIndex((i) => Math.max(i - 1, -1))
  }, [])
  const reset = useCallback(() => {
    setPlaying(false)
    setIndex(-1)
  }, [])
  const togglePlay = useCallback(() => {
    if (atEnd) {
      setIndex(-1)
      setPlaying(true)
    } else {
      setPlaying(!isPlaying)
    }
  }, [atEnd, isPlaying])
  const jumpTo = useCallback((i: number) => {
    setPlaying(false)
    setIndex(i)
  }, [])

  return { index, playing: isPlaying, speed, setSpeed, atEnd, next, prev, reset, togglePlay, jumpTo }
}
