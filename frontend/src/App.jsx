import { createContext, useContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar  from './components/Navbar.jsx'
import Home    from './pages/Home.jsx'
import Analyze from './pages/Analyze.jsx'
import Results from './pages/Results.jsx'

/* ── Dark Mode Context ── */
export const ThemeCtx = createContext({ dark: false, toggle: () => {} })
export const useTheme = () => useContext(ThemeCtx)

export default function App() {
  const [dark,    setDark]    = useState(() => localStorage.getItem('rm-theme') === 'dark')
  const [results, setResults] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('rm-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/analyze" element={<Analyze setResults={setResults} />} />
          <Route path="/results" element={<Results results={results} />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeCtx.Provider>
  )
}
