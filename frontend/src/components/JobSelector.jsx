import { useState, useRef, useEffect } from 'react'
import { useJobs } from '../hooks/useJobs.js'

export default function JobSelector({ onSelect }) {
  const { jobs, loading, search } = useJobs()
  const [open,     setOpen]     = useState(false)
  const [selected, setSelected] = useState(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function pick(job) {
    setSelected(job)
    setOpen(false)
    onSelect(job)
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl
                   text-left transition-all duration-150"
        style={{
          background:  'var(--card)',
          border:      open ? '1px solid var(--clay-border)' : '1px solid var(--border)',
          color:       selected ? 'var(--text)' : 'var(--text3)',
        }}
      >
        <span className="font-mono text-[12px] truncate">
          {selected ? `${selected.title} — ${selected.company}` : 'Select a job role…'}
        </span>
        <svg
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text3)', width: 13, height: 13 }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl overflow-hidden shadow-lg"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {/* search */}
          <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <input
              autoFocus
              placeholder="Search jobs…"
              onChange={e => search(e.target.value)}
              className="w-full px-3 py-2 rounded-lg font-mono text-[12px] outline-none transition-colors"
              style={{
                background:  'var(--bg2)',
                border:      '1px solid var(--border)',
                color:       'var(--text)',
              }}
              onFocus={e  => { e.target.style.borderColor = 'var(--clay-border)' }}
              onBlur={e   => { e.target.style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* list */}
          <div className="max-h-56 overflow-y-auto">
            {loading ? (
              <p className="font-mono text-[11px] text-center py-4" style={{ color: 'var(--text3)' }}>
                Loading…
              </p>
            ) : jobs.length === 0 ? (
              <p className="font-mono text-[11px] text-center py-4" style={{ color: 'var(--text3)' }}>
                No jobs found.
              </p>
            ) : jobs.map(job => (
              <button
                key={job.id}
                type="button"
                onClick={() => pick(job)}
                className="w-full text-left px-4 py-3 transition-colors duration-100"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <p className="font-sans font-medium text-[13px]" style={{ color: 'var(--text)' }}>
                  {job.title}
                </p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
                  {job.company} · {job.location}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
