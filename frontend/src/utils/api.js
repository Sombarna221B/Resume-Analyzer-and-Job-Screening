import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const analyzeResume = (resumeText, jobDesc) =>
  api.post('/analyze', { resume_text: resumeText, job_desc: jobDesc }).then(r => r.data)

export const searchJobs = (q = '', limit = 25) =>
  api.get('/jobs', { params: { q, limit } }).then(r => r.data)

export const parseResume = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/parse-resume', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}
