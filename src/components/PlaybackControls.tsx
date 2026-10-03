import type { usePlayback } from '../hooks/usePlayback'

type Playback = ReturnType<typeof usePlayback>

const SPEEDS = [0.5, 1, 2, 4]

const ICONS = {
  reset: 'M4 4v6h6M4.5 10A8 8 0 1 1 6 16.5',
  prev: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  play: 'M7 4.5v15l12-7.5z',
  pause: 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z',
  replay: 'M4 4v6h6M4.5 10A8 8 0 1 1 6 16.5',
}

function Icon({ name }: { name: keyof typeof ICONS }) {
  const filled = name === 'play' || name === 'pause'
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d={ICONS[name]}
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PlaybackControls({ pb, total }: { pb: Playback; total: number }) {
  return (
    <div className="controls">
      <button type="button" className="icon" onClick={pb.reset} title="Reset" aria-label="Reset">
        <Icon name="reset" />
      </button>
      <button
        type="button"
        className="icon"
        onClick={pb.prev}
        disabled={pb.index < 0}
        title="Previous step (←)"
        aria-label="Previous step"
      >
        <Icon name="prev" />
      </button>
      <button type="button" className="primary" onClick={pb.togglePlay} title="Play / pause (space)">
        <Icon name={pb.playing ? 'pause' : pb.atEnd ? 'replay' : 'play'} />
        {pb.playing ? 'Pause' : pb.atEnd ? 'Replay' : 'Play'}
      </button>
      <button
        type="button"
        className="icon"
        onClick={pb.next}
        disabled={pb.atEnd}
        title="Next step (→)"
        aria-label="Next step"
      >
        <Icon name="next" />
      </button>
      <span className="progress muted small">
        Step {pb.index + 1} of {total}
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
