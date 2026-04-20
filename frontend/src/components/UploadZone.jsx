import { useState, useRef, useCallback } from 'react'
import { parseResume } from '../utils/api.js'

export default function UploadZone({ value, onChange, placeholder, minHeight = 200 }) {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileErr,   setFileErr]   = useState('')
  const fileRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setFileErr('')

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = e => onChange(e.target.result)
      reader.readAsText(file)
      return
    }

    /* PDF / DOCX → server parse */
    setUploading(true)
    try {
      const data = await parseResume(file)
      onChange(data.text)
    } catch (err) {
      setFileErr(err.response?.data?.error || 'Could not parse file.')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const onDrop = useCallback(e => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  return (
    <div className="space-y-1.5">
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className="relative rounded-xl transition-all duration-200"
        style={{
          border:     dragging ? '1.5px dashed var(--clay)' : '1px solid var(--border)',
          background: dragging ? 'var(--clay-faint)' : 'var(--card)',
        }}
      >
        {/* drop overlay */}
        {dragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10 gap-2"
               style={{ background: 'var(--clay-faint)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="var(--clay)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="font-mono text-xs" style={{ color: 'var(--clay)' }}>Drop to load</span>
          </div>
        )}

        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 font-mono text-[12px] leading-relaxed rounded-xl bg-transparent"
          style={{
            minHeight,
            color:       'var(--text)',
            caretColor:  'var(--clay)',
          }}
        />

        {/* drop hint */}
        {!value && !dragging && (
          <div className="absolute bottom-3 right-3.5 flex items-center gap-1.5 pointer-events-none">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                 stroke="var(--text3)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
              drop file
            </span>
          </div>
        )}
      </div>

      {/* actions row */}
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
          {uploading
            ? 'Parsing file…'
            : value?.length
              ? `${value.length.toLocaleString()} chars`
              : 'paste or drop .txt · .pdf · .docx'}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="font-mono text-[11px] transition-opacity hover:opacity-70"
            style={{ color: 'var(--clay)' }}
          >
            Browse
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="font-mono text-[11px] transition-opacity hover:opacity-70"
              style={{ color: 'var(--text3)' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {fileErr && (
        <p className="font-mono text-[11px] px-1" style={{ color: 'var(--red)' }}>{fileErr}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".txt,.pdf,.docx"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}
