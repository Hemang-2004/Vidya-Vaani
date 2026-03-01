import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, Brain, Shield, AlertTriangle } from 'lucide-react'

const LECTURES = [
    { id: 1, title: 'Introduction to Algebra', date: 'Feb 20' },
    { id: 2, title: 'Linear Equations', date: 'Feb 25' },
    { id: 3, title: 'Coordinate Geometry', date: 'Feb 28' },
    { id: 4, title: 'Quadratic Equations', date: 'Mar 1' },
]

export default function UploadSummary() {
    const [selected, setSelected] = useState('')
    const [summary, setSummary] = useState('')
    const [file, setFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)

    const wordCount = summary.trim().split(/\s+/).filter(Boolean).length

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selected || wordCount < 20) return
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 2000))
        setSubmitting(false)
        setResult({
            aiScore: 88,
            plagScore: 4,
            feedback: 'Great understanding! You captured the key concepts — quadratic formula, discriminant, and roots. Try to elaborate more on the graphical interpretation of parabolas.',
            topics: ['Quadratic Formula', 'Discriminant', 'Nature of Roots'],
            status: 'accepted'
        })
    }

    const reset = () => { setResult(null); setSelected(''); setSummary(''); setFile(null) }

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">📄 Upload Learning Summary</h1>
                <p className="page-subtitle">After each lecture, submit your learnings. AI checks quality and originality.</p>
            </div>

            {!result ? (
                <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Lecture Select */}
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>1. Select Lecture</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                            {LECTURES.map(l => (
                                <div key={l.id} onClick={() => setSelected(String(l.id))}
                                    style={{
                                        padding: '14px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                                        border: `2px solid ${selected === String(l.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                        background: selected === String(l.id) ? 'rgba(108,99,255,0.08)' : 'var(--bg-secondary)'
                                    }}>
                                    <div style={{ fontSize: 20, marginBottom: 6 }}>📖</div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{l.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Text */}
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>2. Write Your Summary</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                            In your own words, explain what you learned today. Minimum 50 words.
                        </p>
                        <textarea className="form-input" rows={8} value={summary} onChange={e => setSummary(e.target.value)}
                            placeholder="e.g. Today in class we learned about quadratic equations. The main topics were..."
                            style={{ width: '100%', resize: 'vertical', lineHeight: 1.7 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <span style={{ fontSize: 12, color: wordCount >= 50 ? 'var(--accent-secondary)' : 'var(--text-muted)' }}>
                                {wordCount} words {wordCount >= 50 ? '✓' : `(min 50)`}
                            </span>
                            <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
                                <Brain size={13} style={{ color: 'var(--accent-primary)' }} /> AI Quality Check
                                <Shield size={13} style={{ color: 'var(--accent-secondary)' }} /> Plag Check
                            </div>
                        </div>
                    </div>

                    {/* Optional File */}
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>3. Optional: Attach Notes (PDF/Image)</h3>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 12,
                            border: '2px dashed var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer'
                        }}>
                            <Upload size={18} style={{ color: 'var(--accent-primary)' }} />
                            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{file ? file.name : 'Click to attach notes...'}</span>
                            <input type="file" hidden onChange={e => setFile(e.target.files[0])} />
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" disabled={!selected || wordCount < 20 || submitting}
                        style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16, opacity: !selected || wordCount < 20 ? 0.6 : 1 }}>
                        {submitting ? <><span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-anim 0.8s linear infinite' }} /></> : <><FileText size={18} /> Submit Summary</>}
                    </button>
                </motion.form>
            ) : (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Result Card */}
                    <div className="card" style={{ textAlign: 'center', marginBottom: 20, background: 'linear-gradient(135deg, rgba(72,187,120,0.08), rgba(108,99,255,0.08))', border: '1px solid rgba(72,187,120,0.3)' }}>
                        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
                        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Summary Accepted!</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Your learner map has been updated based on this submission.</p>
                    </div>

                    <div className="grid-2" style={{ marginBottom: 20 }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}><Brain size={14} style={{ display: 'inline', marginRight: 4 }} />AI Quality Score</div>
                            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent-primary)' }}>{result.aiScore}<span style={{ fontSize: 20 }}>/100</span></div>
                            <div style={{ width: '80%', margin: '12px auto 0' }}>
                                <div className="progress-bar">
                                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${result.aiScore}%` }} transition={{ duration: 1 }} />
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}><Shield size={14} style={{ display: 'inline', marginRight: 4 }} />Plagiarism Score</div>
                            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent-secondary)' }}>{result.plagScore}<span style={{ fontSize: 20 }}>%</span></div>
                            <div style={{ marginTop: 12 }}>
                                <span className="badge badge-success"><CheckCircle size={11} /> Original Work</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📝 AI Feedback</h3>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{result.feedback}</p>
                        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Topics identified:</span>
                            {result.topics.map(t => <span key={t} className="badge badge-primary">{t}</span>)}
                        </div>
                    </div>

                    <button onClick={reset} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                        Submit Another Summary
                    </button>
                </motion.div>
            )}
        </div>
    )
}
