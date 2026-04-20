import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalyze }  from '../hooks/useAnalyze.js'
import UploadZone  from '../components/UploadZone.jsx'
import JobSelector from '../components/JobSelector.jsx'

const SAMPLE_RESUME = `Skills
Python (pandas, numpy, scipy, scikit-learn, matplotlib), SQL, Java, JavaScript

Experience
Senior Data Analyst — Razorpay  (2021–present)
Built ETL pipelines in Python and SQL. Dashboards in Tableau.
Automated reporting using pandas, matplotlib, flask APIs. Git version control.

Data Science Intern — Flipkart  (2020–2021)
Exploratory analysis on churn dataset. Logistic regression models.
scikit-learn, seaborn, numpy for feature engineering.

Education
B.Tech Computer Science — IIT Delhi, 2020`

export default function Analyze({ setResults }) {
  const navigate = useNavigate()
  const { analyze, loading, error } = useAnalyze()

  const [resume,  setResume]  = useState('')
  const [job,     setJob]     = useState(null)     // from JobSelector
  const [jobText, setJobText] = useState('')        // manual textarea

  const effectiveJob = jobText.trim() || job?.description || ''
  const canSubmit    = resume.trim().length >= 30 && effectiveJob.length > 0

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit || loading) return
    const result = await analyze(resume, effectiveJob)
    if (result) { setResults(result); navigate('/results') }
  }

  function handleJobSelect(j) {
    setJob(j)
    setJobText('')
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-serif text-[1.9rem] leading-tight mb-1.5" style={{ color: 'var(--text)' }}>
          Analyse your resume
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
          Paste or upload your resume, select a job, and get your full analysis instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Left: Resume ── */}
          <div className="space-y-2 animate-fade-up delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-widest"
                     style={{ color: 'var(--text3)' }}>
                Resume
              </label>
              <button
                type="button"
                onClick={() => setResume(SAMPLE_RESUME)}
                className="font-mono text-[10px] transition-opacity hover:opacity-70"
                style={{ color: 'var(--clay)' }}
              >
                Load sample →
              </button>
            </div>
            <UploadZone
              value={resume}
              onChange={setResume}
              placeholder="Paste your resume text here…"
              minHeight={240}
            />
            {resume.length > 0 && resume.trim().length < 30 && (
              <p className="font-mono text-[11px] px-1" style={{ color: 'var(--red)' }}>
                Resume too short — add at least 30 characters.
              </p>
            )}
          </div>

          {/* ── Right: Job ── */}
          <div className="space-y-4 animate-fade-up delay-200" style={{ animationFillMode: 'forwards' }}>
            <label className="font-mono text-[10px] uppercase tracking-widest block"
                   style={{ color: 'var(--text3)' }}>
              Job Description
            </label>

            {/* dataset picker */}
            <div>
              <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--text3)' }}>
                From the Naukri dataset
              </p>
              <JobSelector onSelect={handleJobSelect} />
            </div>

            {/* divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>or paste manually</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {/* manual textarea */}
            <UploadZone
              value={jobText}
              onChange={text => { setJobText(text); if (text) setJob(null) }}
              placeholder="Paste job description or required skills…"
              minHeight={120}
            />

            {/* selected job preview */}
            {job && !jobText && (
              <div className="p-3.5 rounded-xl"
                   style={{ background: 'var(--clay-faint)', border: '1px solid var(--clay-border)' }}>
                <p className="font-sans font-semibold text-[13px] mb-0.5" style={{ color: 'var(--text)' }}>
                  {job.title}
                </p>
                <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--text3)' }}>
                  {job.company} · {job.location}
                </p>
                <p className="font-mono text-[11px] leading-relaxed line-clamp-2"
                   style={{ color: 'var(--text2)' }}>
                  {job.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 px-4 py-3 rounded-xl"
               style={{ background: 'var(--red-faint)', border: '1px solid var(--red-border)' }}>
            <p className="font-mono text-[12px]" style={{ color: 'var(--red)' }}>{error}</p>
          </div>
        )}

        {/* Submit row */}
        <div className="mt-7 flex items-center justify-between">
          <p className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>
            {canSubmit ? 'Ready — click Run Analysis →' : 'Add resume and a job description to continue'}
          </p>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-sans font-medium text-sm
                       text-white transition-all duration-200"
            style={{
              background:   canSubmit && !loading ? 'var(--clay)' : 'var(--bg3)',
              color:        canSubmit && !loading ? '#fff'        : 'var(--text3)',
              cursor:       canSubmit && !loading ? 'pointer'     : 'not-allowed',
              boxShadow:    canSubmit && !loading ? '0 4px 14px rgba(196,80,26,.25)' : 'none',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin-slow w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                          strokeDasharray="31.4" strokeDashoffset="10"/>
                </svg>
                Analysing…
              </>
            ) : 'Run Analysis'}
          </button>
        </div>
      </form>
    </main>
  )
}
