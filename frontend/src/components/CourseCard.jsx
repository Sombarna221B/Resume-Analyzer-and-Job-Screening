import { difficultyClass, ratingStr } from '../utils/formatters.js'

export default function CourseCard({ course, index = 0 }) {
  const { course_title, university, url, difficulty, rating, skill } = course

  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-3.5 rounded-xl border transition-all duration-200
                 animate-fade-up"
      style={{
        background:   'var(--card2)',
        borderColor:  'var(--border)',
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'forwards',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--clay-border)'
        e.currentTarget.style.background  = 'var(--clay-faint)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background  = 'var(--card2)'
      }}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="min-w-0">
          <p className="font-sans font-medium text-[13px] leading-snug line-clamp-2 transition-colors duration-150"
             style={{ color: 'var(--text)' }}>
            {course_title}
          </p>
          {university && (
            <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
              {university}
            </p>
          )}
        </div>
        <svg className="shrink-0 mt-0.5 transition-colors duration-150"
             style={{ color: 'var(--text3)', width: 13, height: 13 }}
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      {/* bottom row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${difficultyClass(difficulty)}`}>
          {difficulty}
        </span>
        <span className="font-mono text-[11px]" style={{ color: 'var(--amber)' }}>
          {ratingStr(rating)}
        </span>
        <span className="font-mono text-[10px] ml-auto" style={{ color: 'var(--teal)' }}>
          covers: {skill}
        </span>
      </div>
    </a>
  )
}
