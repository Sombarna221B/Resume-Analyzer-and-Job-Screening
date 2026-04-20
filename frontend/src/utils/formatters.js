export function scoreColor(score) {
  if (score >= 72) return 'var(--green)'
  if (score >= 45) return 'var(--clay)'
  return 'var(--red)'
}

export function scoreLabel(score) {
  if (score >= 72) return 'Strong Match'
  if (score >= 45) return 'Partial Match'
  return 'Low Match'
}

export function difficultyClass(level) {
  const map = {
    Beginner:     'bg-[var(--green-faint)] border-[var(--green-border)] text-[var(--green)]',
    Intermediate: 'bg-[var(--clay-faint)]  border-[var(--clay-border)]  text-[var(--clay)]',
    Advanced:     'bg-[var(--red-faint)]   border-[var(--red-border)]   text-[var(--red)]',
    Varies:       'bg-[var(--bg3)]         border-[var(--border)]       text-[var(--text3)]',
    'N/A':        'bg-[var(--bg3)]         border-[var(--border)]       text-[var(--text3)]',
  }
  return map[level] ?? map['N/A']
}

export function ratingStr(rating) {
  if (!rating && rating !== 0) return '—'
  return `${Number(rating).toFixed(1)} ★`
}
