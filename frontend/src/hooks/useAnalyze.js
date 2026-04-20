import { useState, useCallback } from 'react'
import { analyzeResume } from '../utils/api.js'

export function useAnalyze() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const analyze = useCallback(async (resumeText, jobDesc) => {
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeResume(resumeText, jobDesc)
      setData(result)
      return result
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Analysis failed.'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, analyze }
}
