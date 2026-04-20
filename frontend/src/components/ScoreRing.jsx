import { useEffect, useState } from 'react'
import { scoreColor, scoreLabel } from '../utils/formatters.js'

export default function ScoreRing({ score = 0 }) {
  const [displayed, setDisplayed] = useState(0)
  const radius     = 46
  const circ       = 2 * Math.PI * radius
  const offset     = circ - (circ * score) / 100
  const color      = scoreColor(score)

  /* count-up */
  useEffect(() => {
    let current = 0
    let frame
    const step = () => {
      current = Math.min(current + 1, score)
      setDisplayed(current)
      if (current < score) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* track */}
          <circle cx="50" cy="50" r={radius}
            fill="none" stroke="var(--bg3)" strokeWidth="7" />
          {/* fill */}
          <circle cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.4,0,.2,1), stroke .3s' }}
          />
        </svg>
        {/* centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl leading-none" style={{ color: 'var(--text)' }}>
            {displayed}
          </span>
          <span className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
            / 100
          </span>
        </div>
      </div>
      <span className="font-sans text-xs font-semibold tracking-wide" style={{ color }}>
        {scoreLabel(score)}
      </span>
    </div>
  )
}
