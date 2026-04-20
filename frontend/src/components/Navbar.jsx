import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../App.jsx'

const TABS = [
  { to: '/',        label: 'Home'    },
  { to: '/analyze', label: 'Analyse' },
  { to: '/results', label: 'Results' },
]

/* Sun icon */
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  )
}

/* Moon icon */
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const location = useLocation()

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-colors duration-300"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span
            className="w-2 h-2 rounded-full animate-pulse-dot"
            style={{ background: 'var(--clay)' }}
          />
          <span
            className="font-serif text-xl leading-none tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Resu<span style={{ color: 'var(--clay)' }}>Match</span>
          </span>
        </NavLink>

        {/* Tabs — always visible */}
        <nav className="flex items-center gap-1">
          {TABS.map(({ to, label }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap"
                style={{
                  fontFamily: '"Geist", sans-serif',
                  background:  isActive ? 'var(--clay-faint)' : 'transparent',
                  color:       isActive ? 'var(--clay)'       : 'var(--text3)',
                  border:      isActive ? '1px solid var(--clay-border)' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg2)'
                    e.currentTarget.style.color      = 'var(--text2)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color      = 'var(--text3)'
                  }
                }}
              >
                {label}
              </NavLink>
            )
          })}
        </nav>

        {/* Right side — mock badge + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
            style={{
              background:   'var(--clay-faint)',
              border:       '1px solid var(--clay-border)',
              color:        'var(--clay)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--clay)' }} />
            mock mode
          </span>

          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background:   'var(--bg2)',
              border:       '1px solid var(--border)',
              color:        'var(--text3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border2)'
              e.currentTarget.style.color       = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color       = 'var(--text3)'
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

      </div>
    </header>
  )
}
