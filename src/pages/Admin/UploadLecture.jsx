import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Brain, BookOpen, Clock, CheckCircle, Video, Trash2, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PREV_LECTURES = [
    { id: 1, title: 'Introduction to Algebra', date: 'Feb 20', duration: '52 min', students: 38, summary: 'Covered variables, expressions and basic equations. Homework: Practice problems 1-10.', homework: 'Problems 1.1–1.10 from textbook' },
    { id: 2, title: 'Linear Equations', date: 'Feb 25', duration: '48 min', students: 40, summary: 'Solving one and two-variable equations. Key formula discussed: ax + b = c.', homework: 'Worksheet on linear equations' },
    { id: 3, title: 'Coordinate Geometry', date: 'Feb 28', duration: '55 min', students: 41, summary: 'Cartesian plane, plotting points, distance formula, midpoint formula.', homework: 'Graph 10 coordinate pairs from Section 3' },
]

export default function UploadLecture() {
    const { t } = useTranslation()
    const [dragOver, setDragOver] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [expanded, setExpanded] = useState(null)

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false)
        setProcessing(true)
        setTimeout(() => { setProcessing(false); setUploaded(true) }, 2200)
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">📤 {t('a_upload')}</h1>
                <p className="page-subtitle">Upload lecture recordings and get AI-powered summaries & homework suggestions instantly</p>
            </div>

            {/* Upload Zone */}
            <motion.div
                className={`upload-zone ${dragOver ? 'drag-over' : ''} ${uploaded ? 'uploaded' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
                {processing ? (
                    <div style={{ textAlign: 'center' }}>
                        <div className="upload-spinner" />
                        <div style={{ marginTop: 16, fontWeight: 600 }}>🤖 AI is processing your lecture...</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Generating summary, extracting key points & homework suggestions</div>
                    </div>
                ) : uploaded ? (
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={48} style={{ color: 'var(--accent-secondary)', marginBottom: 12 }} />
                        <div style={{ fontWeight: 700, fontSize: 18 }}>Lecture Uploaded Successfully! 🎉</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>AI summary has been generated and sent to students</div>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Drop your lecture recording here</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>MP4, AVI, MOV, PDF slides supported • Max 2GB</div>
                        <label className="btn-primary" style={{ cursor: 'pointer' }}>
                            <Upload size={16} /> Browse Files
                            <input type="file" hidden onChange={() => { setProcessing(true); setTimeout(() => { setProcessing(false); setUploaded(true) }, 2200) }} />
                        </label>
                    </>
                )}
            </motion.div>

            {/* AI Features Banner */}
            {uploaded && (
                <motion.div className="card" style={{ marginTop: 20, background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(72,187,120,0.08))', border: '1px solid rgba(108,99,255,0.2)' }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ fontWeight: 700, marginBottom: 16 }}>✨ AI Generated Summary — "Introduction to Quadratics"</div>
                    <div className="grid-3" style={{ gap: 12 }}>
                        {[
                            { icon: Brain, label: 'Key Topics', value: 'Quadratic formula, vertex, discriminant, parabola graphing', color: '#6c63ff' },
                            { icon: BookOpen, label: 'Homework Suggestion', value: 'Solve 5 quadratic equations using the formula (pg 42)', color: '#48bb78' },
                            { icon: Clock, label: 'Duration Analyzed', value: '47 min • 3 topic segments identified', color: '#f6ad55' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}18`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setUploaded(false)}>
                        <Plus size={16} /> Upload Another Lecture
                    </button>
                </motion.div>
            )}

            {/* Previous Lectures */}
            <div style={{ marginTop: 32 }}>
                <h3 className="section-heading" style={{ marginTop: 0 }}>📚 Previous Lectures</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {PREV_LECTURES.map((lec, i) => (
                        <motion.div key={lec.id} className="card" style={{ cursor: 'pointer' }}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                            onClick={() => setExpanded(expanded === lec.id ? null : lec.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{lec.title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lec.date} • {lec.duration} • {lec.students} students attended</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <span className="badge badge-success"><CheckCircle size={11} /> Summarized</span>
                                </div>
                            </div>
                            {expanded === lec.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div style={{ padding: 14, background: 'var(--bg-secondary)', borderRadius: 10 }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>🤖 AI SUMMARY</div>
                                            <div style={{ fontSize: 13, lineHeight: 1.6 }}>{lec.summary}</div>
                                        </div>
                                        <div style={{ padding: 14, background: 'rgba(72,187,120,0.08)', borderRadius: 10, border: '1px solid rgba(72,187,120,0.2)' }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: 6 }}>📝 HOMEWORK GIVEN</div>
                                            <div style={{ fontSize: 13, lineHeight: 1.6 }}>{lec.homework}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
        .upload-zone {
          border: 2px dashed var(--border-color); border-radius: 20px; padding: 60px 40px;
          text-align: center; cursor: pointer; transition: all 0.25s;
          background: var(--bg-card);
        }
        .upload-zone.drag-over { border-color: var(--accent-primary); background: rgba(108,99,255,0.05); }
        .upload-zone.uploaded { border-color: var(--accent-secondary); border-style: solid; }
        .upload-spinner {
          width: 48px; height: 48px; border: 4px solid var(--border-color);
          border-top-color: var(--accent-primary); border-radius: 50%;
          animation: spin-anim 1s linear infinite; margin: 0 auto;
        }
        @keyframes spin-anim { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}
