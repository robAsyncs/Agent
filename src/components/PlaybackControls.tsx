import type { usePlayback } from '../hooks/usePlayback'

type Playback = ReturnType<typeof usePlayback>

const SPEEDS = [0.5, 1, 2, 4]

export function PlaybackControls({ pb, total }: { pb: Playback; total: number }) {
  return (
    <div className="controls">
      <button type="button" onClick={pb.reset} title="Reset">
        ⏮
      </button>
      <button type="button" onClick={pb.prev} disabled={pb.index < 0} title="Previous step (←)">
        ◀
      </button>
      <button type="button" className="primary" onClick={pb.togglePlay} title="Play / pause (space)">
        {pb.playing ? '❚❚ Pause' : pb.atEnd ? '↻ Replay' : '▶ Play'}
      </button>
      <button type="button" onClick={pb.next} disabled={pb.atEnd} title="Next step (→)">
        ▶
      </button>
      <span className="progress muted small">
        {pb.index + 1} / {total}
      </span>
      <div className="speed" role="group" aria-label="Playback speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            className={pb.speed === s ? 'on' : ''}
            onClick={() => pb.setSpeed(s)}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  )
}
