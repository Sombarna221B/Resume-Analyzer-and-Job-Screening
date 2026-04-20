import { useNavigate } from 'react-router-dom'
import ScoreRing     from '../components/ScoreRing.jsx'
import SkillGapChart from '../components/SkillGapChart.jsx'
import CourseCard    from '../components/CourseCard.jsx'
import ExplainPanel  from '../components/ExplainPanel.jsx'

/* ── DEMO DATA shown when no real results yet ── */
const DEMO = {
  match_score:       74,
  tfidf_similarity:  63,
  skill_overlap_pct: 50,
  mock_mode:         true,
  skill_gap: {
    matched:   ['python', 'analytics', 'machine learning'],
    missing:   ['scala', 'statistical modeling', 'statistics'],
    bonus:     ['sql', 'pandas', 'numpy', 'tableau', 'flask', 'git'],
    gap_score: 50.0,
  },
  recommended_courses: [
    { course_title: 'Parallel Programming (Scala)',                       university: 'EPFL · Coursera',                 url: 'https://www.coursera.org/learn/scala-parallel-programming', difficulty: 'Intermediate', rating: 4.4, skill: 'scala',              relevance: 1 },
    { course_title: 'Improving Your Statistical Questions',               university: 'Eindhoven University · Coursera', url: 'https://www.coursera.org/learn/improving-statistical-questions', difficulty: 'Beginner',  rating: 4.9, skill: 'statistics',         relevance: 1 },
    { course_title: 'Bayesian Statistics: Concept to Data Analysis',      university: 'UC Santa Cruz · Coursera',        url: 'https://www.coursera.org/learn/bayesian-statistics',         difficulty: 'Intermediate', rating: 4.6, skill: 'statistics',         relevance: 1 },
    { course_title: 'Fitting Statistical Models to Data with Python',     university: 'Univ. of Michigan · Coursera',    url: 'https://www.coursera.org/learn/fitting-statistical-models', difficulty: 'Intermediate', rating: 4.3, skill: 'statistical modeling', relevance: 1 },
    { course_title: 'Coursera Search: Statistical Modeling',              university: 'Coursera',                        url: 'https://www.coursera.org/search?query=statistical+modeling', difficulty: 'Varies',       rating: null, skill: 'statistical modeling',relevance: 0 },
  ],
  explainability: {
    decision_factors: { tfidf_similarity: 63, skill_overlap: 50 },
    reasoning: [
      'Moderate keyword overlap — consider mirroring key terms from the job description.',
      'Partial skill coverage (50.0%) — targeted upskilling recommended: scala, statistical modeling, statistics.',
    ],
    model: 'Rule-based mock (set MOCK_MODE=false to use trained Random Forest)',
  },
}

function Panel({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <p className="font-mono text-[9px] uppercase tracking-widest mb-4"
         style={{ color: 'var(--text3)' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

export default function Results({ results }) {
  const navigate = useNavigate()
  const data     = results ?? DEMO
  const isDemo   = !results

  const {
    match_score, tfidf_similarity, skill_overlap_pct,
    skill_gap, recommended_courses, explainability, mock_mode,
  } = data

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-up"
           style={{ animationFillMode: 'forwards' }}>
        <div>
          <h1 className="font-serif text-[1.8rem] leading-tight mb-1" style={{ color: 'var(--text)' }}>
            Analysis Results
          </h1>
          <p className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
            {isDemo
              ? 'Demo data — run an analysis to see your real results'
              : mock_mode
                ? 'Mock mode · rule-based scoring · set MOCK_MODE=false for real RF'
                : 'Random Forest · 94.0% test accuracy'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {mock_mode && (
            <span
              className="font-mono text-[10px] px-2.5 py-1 rounded-full"
              style={{ background: 'var(--clay-faint)', border: '1px solid var(--clay-border)', color: 'var(--clay)' }}
            >
              ◆ mock
            </span>
          )}
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all duration-150"
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border2)'
              e.currentTarget.style.background  = 'var(--bg2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background  = 'transparent'
            }}
          >
            New analysis
          </button>
        </div>
      </div>

      {/* Top row: Score + Skill Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 mb-4
                      animate-fade-up delay-100"
           style={{ animationFillMode: 'forwards' }}>

        {/* Score panel */}
        <Panel title="Match Score">
          <div className="flex flex-col items-center gap-5">
            <ScoreRing score={match_score} />

            {/* meta stats */}
            <div className="w-full grid grid-cols-2 gap-3 pt-4"
                 style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1"
                   style={{ color: 'var(--text3)' }}>
                  Keyword sim.
                </p>
                <p className="font-serif text-2xl leading-none" style={{ color: 'var(--blue)' }}>
                  {tfidf_similarity}
                  <span className="font-mono text-[11px] ml-0.5" style={{ color: 'var(--text3)' }}>%</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1"
                   style={{ color: 'var(--text3)' }}>
                  Skill overlap
                </p>
                <p className="font-serif text-2xl leading-none" style={{ color: 'var(--teal)' }}>
                  {skill_overlap_pct}
                  <span className="font-mono text-[11px] ml-0.5" style={{ color: 'var(--text3)' }}>%</span>
                </p>
              </div>
            </div>
          </div>
        </Panel>

        {/* Skill gap panel */}
        <Panel title="Skill Gap Analysis">
          <SkillGapChart skillGap={skill_gap} />
        </Panel>
      </div>

      {/* Bottom row: Courses + XAI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4
                      animate-fade-up delay-200"
           style={{ animationFillMode: 'forwards' }}>

        <Panel title={`Recommended Courses · ${recommended_courses?.length ?? 0}`}>
          <div className="space-y-2">
            {recommended_courses?.map((c, i) => (
              <CourseCard key={i} course={c} index={i} />
            ))}
          </div>
        </Panel>

        <Panel title="Explainable AI">
          <ExplainPanel explainability={explainability} mockMode={mock_mode} />
        </Panel>

      </div>

      {/* Raw JSON (collapsible dev view) */}
      <details
        className="mt-6 animate-fade-up delay-300"
        style={{ animationFillMode: 'forwards' }}
      >
        <summary
          className="font-mono text-[11px] cursor-pointer select-none transition-opacity hover:opacity-70"
          style={{ color: 'var(--text3)' }}
        >
          Raw API response
        </summary>
        <pre
          className="mt-3 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto"
          style={{
            background: 'var(--bg2)',
            border:     '1px solid var(--border)',
            color:      'var(--text2)',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>

    </main>
  )
}
