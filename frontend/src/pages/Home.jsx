import { useNavigate } from 'react-router-dom'

const STATS = [
  { value: '332',  label: 'Resumes trained'   },
  { value: '12K',  label: 'Jobs indexed'       },
  { value: '94%',  label: 'RF accuracy'        },
  { value: '3.5K', label: 'Coursera courses'   },
]

const FEATURES = [
  { icon: '◎', title: 'Match Score',    body: 'RF + TF-IDF model scores your resume 0–100 against any job description.'               },
  { icon: '△', title: 'Skill Gap',      body: 'See matched, missing and bonus skills instantly from a 51-skill taxonomy.'               },
  { icon: '▣', title: 'Course Recs',   body: '3,522 real Coursera courses matched to your gaps, ranked by rating.'                    },
  { icon: '◈', title: 'Explainable AI', body: 'SHAP-backed decision factors break down exactly what drove your match score.'           },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Hero */}
      <section className="max-w-xl mb-14 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        {/* eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
          style={{ background: 'var(--clay-faint)', border: '1px solid var(--clay-border)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ background: 'var(--clay)' }}
          />
          <span className="font-mono text-[11px]" style={{ color: 'var(--clay)' }}>
            94.0% RF accuracy · mock mode active
          </span>
        </div>

        <h1
          className="font-serif text-5xl leading-[1.15] tracking-tight mb-5"
          style={{ color: 'var(--text)' }}
        >
          Know your gap.<br />
          <em style={{ color: 'var(--clay)', fontStyle: 'italic' }}>Close it fast.</em>
        </h1>

        <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--text2)', maxWidth: 440 }}>
          Upload your resume, pick a role, and get a match score, precise skill gaps,
          and hand-picked Coursera recommendations — powered by your trained Random Forest model.
        </p>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-2.5 rounded-xl font-sans font-medium text-sm text-white
                       transition-all duration-200 hover:-translate-y-px"
            style={{
              background:  'var(--clay)',
              boxShadow:   '0 4px 14px rgba(196,80,26,.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--clay2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--clay)'  }}
          >
            Analyse my resume
          </button>
          <button
            onClick={() => navigate('/results')}
            className="px-6 py-2.5 rounded-xl font-sans font-medium text-sm transition-all duration-200"
            style={{
              background:  'transparent',
              border:      '1px solid var(--border)',
              color:       'var(--text2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border2)'
              e.currentTarget.style.background  = 'var(--bg2)'
              e.currentTarget.style.color       = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background  = 'transparent'
              e.currentTarget.style.color       = 'var(--text2)'
            }}
          >
            View sample results
          </button>
        </div>
      </section>

      {/* Stats */}
      <section
        className="grid grid-cols-4 mb-14 overflow-hidden rounded-2xl animate-fade-up delay-100"
        style={{
          border:      '1px solid var(--border)',
          background:  'var(--border)',
          gap:         '1px',
          animationFillMode: 'forwards',
        }}
      >
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center py-6 px-4" style={{ background: 'var(--card)' }}>
            <div className="font-serif text-3xl leading-none mb-2" style={{ color: 'var(--clay)' }}>
              {value}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-5 text-center"
           style={{ color: 'var(--text3)' }}>
          What you get
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURES.map(({ icon, title, body }) => (
            <div
              key={title}
              className="p-5 rounded-2xl transition-all duration-200"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--clay-border)'
                e.currentTarget.style.background  = 'var(--clay-faint)'
                e.currentTarget.style.transform   = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background  = 'var(--card)'
                e.currentTarget.style.transform   = 'none'
              }}
            >
              <span className="text-xl block mb-3" style={{ color: 'var(--clay)' }}>{icon}</span>
              <h3 className="font-sans font-semibold text-[13px] mb-2" style={{ color: 'var(--text)' }}>
                {title}
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text3)' }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <footer className="mt-16 pt-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>
          332 resumes × 12K Naukri jobs · Random Forest + TF-IDF · SHAP XAI · 3,522 Coursera courses
        </p>
      </footer>

    </main>
  )
}
