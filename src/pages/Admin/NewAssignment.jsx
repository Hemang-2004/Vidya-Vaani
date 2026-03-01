import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Calendar, FileText, Upload, Video, File, X, CheckCircle, Lightbulb } from 'lucide-react'

const TOPICS = ['Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Calculus']
const TYPES = ['Problem Set', 'Essay', 'Project', 'MCQ Quiz', 'Practical']
const HINT_COLORS = ['#48bb78', '#f6ad55', '#fc8181', '#9f8fff']

const EMPTY = {
    title: '', topic: TOPICS[0], type: TYPES[0], due: '',
    maxMarks: 10, description: '', instructions: '',
    hints: ['', '', ''], allowLate: false, showHints: true,
    files: [],
}

export default function NewAssignment() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [done, setDone] = useState(false)
    const fileRef = useRef()
    const videoRef = useRef()

    const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const updHint = (i, v) => setForm(f => ({ ...f, hints: f.hints.map((h, idx) => idx === i ? v : h) }))
    const addHint = () => form.hints.length < 3 && setForm(f => ({ ...f, hints: [...f.hints, ''] }))
    const rmHint = (i) => setForm(f => ({ ...f, hints: f.hints.filter((_, idx) => idx !== i) }))

    const markAfterHints = (n) => Math.max(1, form.maxMarks - [0, Math.ceil(form.maxMarks * 0.1), Math.ceil(form.maxMarks * 0.3), Math.ceil(form.maxMarks * 0.6)][Math.min(n, 3)])

    const addFiles = (fileList, type) => {
        const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size, type, url: URL.createObjectURL(f), file: f }))
        setForm(f => ({ ...f, files: [...f.files, ...newFiles] }))
    }
    const removeFile = (i) => setForm(f => ({ ...f, files: f.files.filter((_, idx) => idx !== i) }))

    const handleCreate = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaving(false)
        setDone(true)
        setTimeout(() => navigate('/admin/assignments'), 1800)
    }

    const docFiles = form.files.filter(f => f.type === 'doc')
    const vidFiles = form.files.filter(f => f.type === 'video')

    if (done) return (
        <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <motion.div style={{ textAlign: 'center' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Assignment Created!</h2>
                <p style={{ color: 'var(--text-muted)' }}>Redirecting to Assignments...</p>
            </motion.div>
        </div>
    )

    return (
        <div className="page-content" style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <button onClick={() => navigate('/admin/assignments')}
                    style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="page-title" style={{ marginBottom: 2 }}>✏️ New Assignment</h1>
                    <p className="page-subtitle">Fill in the details to publish a new assignment to your class</p>
                </div>
            </div>

            {/* Step Progress */}
            <div className="card" style={{ marginBottom: 24, padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: 0 }}>
                    {[{ n: 1, label: 'Details' }, { n: 2, label: 'Hints' }, { n: 3, label: 'Upload' }, { n: 4, label: 'Review' }].map((s, i, arr) => (
                        <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, transition: 'all 0.3s',
                                    background: step > s.n ? 'var(--accent-secondary)' : step === s.n ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                    color: step >= s.n ? 'white' : 'var(--text-muted)',
                                    border: `2px solid ${step >= s.n ? (step > s.n ? 'var(--accent-secondary)' : 'var(--accent-primary)') : 'var(--border-color)'}`
                                }}>
                                    {step > s.n ? <CheckCircle size={16} /> : s.n}
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: step >= s.n ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s.label}</span>
                            </div>
                            {i < arr.length - 1 && (
                                <div style={{ flex: 1, height: 2, margin: '0 8px', marginBottom: 20, background: step > s.n ? 'var(--accent-secondary)' : 'var(--border-color)', transition: 'background 0.3s' }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* STEP 1: Details */}
                {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                        <div className="card" style={{ marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 18 }}>📚 Basic Details</h3>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label">Assignment Title *</label>
                                <input className="form-input" value={form.title} onChange={e => upd('title', e.target.value)}
                                    placeholder="e.g. Quadratic Equations — Problem Set" style={{ fontSize: 15 }} />
                            </div>
                            <div className="grid-2" style={{ gap: 14, marginBottom: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">📖 Topic</label>
                                    <select className="form-input" value={form.topic} onChange={e => upd('topic', e.target.value)}>
                                        {TOPICS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📄 Assignment Type</label>
                                    <select className="form-input" value={form.type} onChange={e => upd('type', e.target.value)}>
                                        {TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid-2" style={{ gap: 14, marginBottom: 16 }}>
                                <div className="form-group">
                                    <label className="form-label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Due Date *</label>
                                    <input className="form-input" type="date" value={form.due} onChange={e => upd('due', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">🔢 Max Marks</label>
                                    <input className="form-input" type="number" min={1} max={100} value={form.maxMarks} onChange={e => upd('maxMarks', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label"><FileText size={12} style={{ display: 'inline', marginRight: 4 }} />Description</label>
                                <textarea className="form-input" rows={3} value={form.description} onChange={e => upd('description', e.target.value)}
                                    placeholder="What is this assignment about? What will students practice?" style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">📋 Instructions for Students</label>
                                <textarea className="form-input" rows={3} value={form.instructions} onChange={e => upd('instructions', e.target.value)}
                                    placeholder="e.g. Show all steps, no calculator allowed, submit as PDF" style={{ resize: 'vertical' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: HINTS */}
                {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                        <div className="card" style={{ marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>💡 Hint Configuration</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
                                Each hint request reduces the student's score. Configure up to 3 hints.
                            </p>

                            {/* Live preview */}
                            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(246,173,85,0.08)', border: '1px solid rgba(246,173,85,0.25)', marginBottom: 22 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>⚡ Live Mark Deduction Preview (Max: {form.maxMarks})</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(72,187,120,0.15)', fontSize: 12, fontWeight: 700, color: '#48bb78' }}>No hints → {form.maxMarks} marks 🏆</span>
                                    {form.hints.map((_, i) => (
                                        <span key={i} style={{ padding: '5px 12px', borderRadius: 8, background: `${HINT_COLORS[i] || '#9f8fff'}18`, fontSize: 12, fontWeight: 700, color: HINT_COLORS[i] || '#9f8fff' }}>
                                            {i + 1} hint → {markAfterHints(i + 1)} marks
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {form.hints.map((hint, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                    style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${HINT_COLORS[i] || '#9f8fff'}20`, color: HINT_COLORS[i] || '#9f8fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 8 }}>
                                        {i + 1}
                                    </div>
                                    <textarea className="form-input" rows={2} value={hint} onChange={e => updHint(i, e.target.value)}
                                        placeholder={`Hint ${i + 1}: Give a gentle nudge without revealing the answer`}
                                        style={{ flex: 1, resize: 'vertical', fontSize: 13 }} />
                                    {form.hints.length > 1 && (
                                        <button onClick={() => rmHint(i)} style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', color: 'var(--accent-danger)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 8 }}>
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                            {form.hints.length < 3 && (
                                <button onClick={addHint} className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>
                                    <Plus size={13} /> Add Hint
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: UPLOAD */}
                {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                        {/* Document Upload */}
                        <div className="card" style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(108,99,255,0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <File size={18} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>Upload Documents</h3>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF, Word, or images — assignment sheets, reference material</p>
                                </div>
                            </div>
                            <div onClick={() => fileRef.current?.click()}
                                style={{ marginTop: 14, padding: '28px 20px', borderRadius: 14, border: '2px dashed var(--accent-primary)', background: 'rgba(108,99,255,0.04)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                                <Upload size={28} style={{ color: 'var(--accent-primary)', marginBottom: 8 }} />
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Click to upload documents</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF, DOCX, PNG, JPG • Max 10 MB each</div>
                                <input ref={fileRef} type="file" hidden multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    onChange={e => addFiles(e.target.files, 'doc')} />
                            </div>
                            {docFiles.length > 0 && (
                                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {docFiles.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--bg-secondary)' }}>
                                            <File size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(f.size / 1024).toFixed(1)} KB</div>
                                            </div>
                                            <span className="badge badge-success">Uploaded</span>
                                            <button onClick={() => removeFile(form.files.indexOf(f))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video Upload */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(252,129,129,0.12)', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Video size={18} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>Upload Video</h3>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>MP4, MOV — instructional video for students</p>
                                </div>
                            </div>
                            <div onClick={() => videoRef.current?.click()}
                                style={{ marginTop: 14, padding: '28px 20px', borderRadius: 14, border: '2px dashed #fc8181', background: 'rgba(252,129,129,0.04)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                                <Video size={28} style={{ color: '#fc8181', marginBottom: 8 }} />
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Click to upload video</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>MP4, MOV, AVI • Max 500 MB</div>
                                <input ref={videoRef} type="file" hidden multiple accept="video/*"
                                    onChange={e => addFiles(e.target.files, 'video')} />
                            </div>
                            {vidFiles.length > 0 && (
                                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {vidFiles.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--bg-secondary)' }}>
                                            <Video size={16} style={{ color: '#fc8181', flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(f.size / 1024 / 1024).toFixed(1)} MB</div>
                                            </div>
                                            <span className="badge badge-danger" style={{ background: 'rgba(252,129,129,0.15)', color: '#fc8181' }}>Video</span>
                                            <button onClick={() => removeFile(form.files.indexOf(f))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: REVIEW + SETTINGS */}
                {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                        {/* Settings */}
                        <div className="card" style={{ marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>⚙️ Settings</h3>
                            {[{ label: 'Allow Late Submissions', key: 'allowLate', icon: '⏰' }, { label: 'Show Hints to Students', key: 'showHints', icon: '💡' }].map(s => (
                                <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: 'var(--bg-secondary)', marginBottom: 10 }}>
                                    <span style={{ fontSize: 14, fontWeight: 500 }}>{s.icon} {s.label}</span>
                                    <div onClick={() => upd(s.key, !form[s.key])} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'background 0.3s', position: 'relative', background: form[s.key] ? 'var(--accent-primary)' : 'var(--border-color)' }}>
                                        <div style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.3s', left: form[s.key] ? 22 : 2 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Summary */}
                        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.08),rgba(72,187,120,0.06))', border: '1px solid rgba(108,99,255,0.2)' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>📋 Final Review</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    ['Title', form.title || '(not set)'],
                                    ['Topic', form.topic], ['Type', form.type],
                                    ['Due Date', form.due || '(not set)'],
                                    ['Max Marks', `${form.maxMarks}`],
                                    ['Hints', `${form.hints.filter(h => h.trim()).length} configured`],
                                    ['Documents', `${docFiles.length} file(s)`],
                                    ['Videos', `${vidFiles.length} file(s)`],
                                    ['Late Submit', form.allowLate ? 'Allowed ✓' : 'Not allowed'],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                                        <span style={{ fontWeight: 600 }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12, position: 'sticky', bottom: 0, background: 'var(--bg-secondary)', padding: '16px 0', borderTop: '1px solid var(--border-color)' }}>
                {step > 1
                    ? <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
                    : <button className="btn-secondary" onClick={() => navigate('/admin/assignments')}><ArrowLeft size={15} /> Cancel</button>}
                {step < 4
                    ? <motion.button className="btn-primary" onClick={() => setStep(s => s + 1)} whileTap={{ scale: 0.97 }}
                        disabled={step === 1 && !form.title} style={{ opacity: step === 1 && !form.title ? 0.6 : 1 }}>
                        Continue →
                    </motion.button>
                    : <motion.button className="btn-primary" onClick={handleCreate} whileTap={{ scale: 0.97 }} disabled={saving}
                        style={{ minWidth: 180, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
                        {saving
                            ? <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-anim 0.8s linear infinite' }} />
                            : '🚀 Publish Assignment'}
                    </motion.button>}
            </div>
        </div>
    )
}
