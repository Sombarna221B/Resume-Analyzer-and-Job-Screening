function FactorBar({ label, value, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>{label}</span>
        <span className="font-mono text-[11px] font-medium" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color, transitionDelay: '300ms' }}
        />
      </div>
    </div>
  )
}

export default function ExplainPanel({ explainability, mockMode }) {
  const { decision_factors = {}, reasoning = [], model = '' } = explainability ?? {}

  return (
    <div>
      {/* mock warning */}
      {mockMode && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4"
             style={{ background: 'var(--clay-faint)', border: '1px solid var(--clay-border)' }}>
          <span className="text-xs mt-0.5 shrink-0" style={{ color: 'var(--clay)' }}>◆</span>
          <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'var(--clay)' }}>
            Mock mode — rule-based scoring.{' '}
            <code className="px-1 py-0.5 rounded text-[10px]"
                  style={{ background: 'var(--bg3)' }}>
              MOCK_MODE=false
            </code>{' '}
            to use the trained Random Forest.
          </p>
        </div>
      )}

      {/* factors */}
      <p className="font-mono text-[9px] uppercase tracking-widest mb-3"
         style={{ color: 'var(--text3)' }}>
        Decision Factors
      </p>
      <FactorBar
        label="TF-IDF Keyword Similarity"
        value={decision_factors.tfidf_similarity ?? 0}
        color="var(--blue)"
      />
      <FactorBar
        label="Skill Overlap"
        value={decision_factors.skill_overlap ?? 0}
        color="var(--teal)"
      />

      {/* reasoning */}
      <p className="font-mono text-[9px] uppercase tracking-widest mt-5 mb-3"
         style={{ color: 'var(--text3)' }}>
        Reasoning
      </p>
      <ul className="space-y-2">
        {reasoning.map((r, i) => (
          <li key={i} className="flex gap-2.5 text-[12.5px] leading-snug"
              style={{ color: 'var(--text2)' }}>
            <span className="shrink-0 mt-0.5" style={{ color: 'var(--clay)' }}>—</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {/* model */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="font-mono text-[9px] uppercase tracking-widest mb-1"
           style={{ color: 'var(--text3)' }}>Model</p>
        <p className="font-mono text-[11px]" style={{ color: 'var(--text3)' }}>{model}</p>
      </div>
    </div>
  )
}
