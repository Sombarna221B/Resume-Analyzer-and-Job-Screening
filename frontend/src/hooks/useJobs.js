import { useState, useEffect, useRef, useCallback } from 'react'
import { searchJobs } from '../utils/api.js'

export function useJobs(debounceMs = 300) {
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  const search = useCallback((q = '') => {
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchJobs(q, 30)
        setJobs(data.jobs || [])
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }, debounceMs)
  }, [debounceMs])

  useEffect(() => { search('') }, [])

  return { jobs, loading, search }
}
