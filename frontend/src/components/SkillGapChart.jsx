const TYPES = {
  matched: {
    label: 'Matched',
    tagCls: 'bg-[var(--green-faint)] border-[var(--green-border)] text-[var(--green)]',
  },
  missing: {
    label: 'Missing',
    tagCls: 'bg-[var(--red-faint)] border-[var(--red-border)] text-[var(--red)]',
  },
  bonus: {
    label: 'Bonus',
    tagCls: 'bg-[var(--blue-faint)] border-[var(--blue-border)] text-[var(--blue)]',
  },
}

function Section({ type, skills }) {
  const { label, tagCls } = TYPES[type]
  if (!skills?.length) return null
  return (
    <div className="mb-4">
      <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
        {label} · {skills.length}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map(s => (
          <span key={s} className={`font-mono text-[11px] px-2.5 py-1 rounded-md border ${tagCls}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SkillGapChart({ skillGap }) {
  const { matched = [], missing = [], bonus = [], gap_score = 0 } = skillGap ?? {}

  return (
    <div>
      {/* coverage bar */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>Skill coverage</span>
        <span className="font-mono text-[10px]" style={{ color: 'var(--text2)' }}>{gap_score}%</span>
      </div>
      <div className="h-1 rounded-full mb-5" style={{ background: 'var(--bg3)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${gap_score}%`,
            background: 'linear-gradient(90deg, var(--clay), var(--clay3))',
          }}
        />
      </div>

      <Section type="matched" skills={matched} />
      <Section type="missing" skills={missing} />
      <Section type="bonus"   skills={bonus}   />

      {!matched.length && !missing.length && (
        <p className="font-mono text-xs" style={{ color: 'var(--text3)' }}>
          No skills detected — add more technical terms to the resume or job description.
        </p>
      )}
    </div>
  )
}
