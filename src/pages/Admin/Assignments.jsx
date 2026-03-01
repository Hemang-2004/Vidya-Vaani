import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronDown, ChevronUp, Clock, Users, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react'

const MARK_DEDUCTIONS = [
    { marks: 10, label: 'No Hints', color: '#48bb78', emoji: '🏆' },
    { marks: 9, label: '1 Hint Used', color: '#f6ad55', emoji: '💡' },
    { marks: 7, label: '2 Hints Used', color: '#fc8181', emoji: '⚠️' },
    { marks: 4, label: '3 Hints Used', color: '#9f8fff', emoji: '📖' },
]

const INITIAL = [
    {
        id: 1, title: 'Quadratic Equations — Problem Set', due: 'Mar 5', topic: 'Algebra', maxMarks: 10, total: 42, submitted: 35, flagged: 2,
        hints: ['Identify a, b, c in ax²+bx+c=0', 'Try factoring before the formula', 'Use x=(−b±√(b²−4ac))/2a'],
        submissions: [
            { name: 'Arjun Mehta', hints: 0, score: 10, status: 'ok' },
            { name: 'Priya Nair', hints: 1, score: 9, status: 'ok' },
            { name: 'Sneha Patel', hints: 2, score: 7, status: 'flagged' },
        ]
    },
    {
        id: 2, title: 'Coordinate Geometry Practice', due: 'Mar 8', topic: 'Geometry', maxMarks: 10, total: 42, submitted: 22, flagged: 0,
        hints: ['Plot points on graph paper first', 'Use d=√((x₂−x₁)²+(y₂−y₁)²)'],
        submissions: []
    },
]

export default function Assignments() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [assignments] = useState(INITIAL)
    const [expanded, setExpanded] = useState(1)

    return (
        <div className="page-content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">📋 {t('a_assignments')}</h1>
                    <p className="page-subtitle">Manage assignments with the AI-powered hint-based grading system</p>
                </div>
                <motion.button className="btn-primary" onClick={() => navigate('/admin/assignments/new')} whileTap={{ scale: 0.97 }}>
                    <Plus size={16} /> New Assignment
                </motion.button>
            </div>

            {/* Grading explainer */}
            <motion.div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg,rgba(108,99,255,.06),rgba(72,187,120,.06))', border: '1px solid rgba(108,99,255,.2)' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ fontWeight: 700, marginBottom: 14 }}>🎯 Hint-Based Grading System</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {MARK_DEDUCTIONS.map((m, i) => (
                        <div key={i} style={{ flex: 1, minWidth: 130, padding: '12px 16px', borderRadius: 12, background: `${m.color}12`, border: `1px solid ${m.color}30`, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, marginBottom: 4 }}>{m.emoji}</div>
                            <div style={{ fontWeight: 800, fontSize: 20, color: m.color }}>{m.marks}/10</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Assignment cards */}
            {assignments.map((a, i) => (
                <motion.div key={a.id} className="card" style={{ marginBottom: 16 }}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <div style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{a.title}</h3>
                                    <span className="badge badge-primary">{a.topic}</span>
                                    {a.flagged > 0 && <span className="badge badge-danger"><AlertTriangle size={10} /> {a.flagged} flagged</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <span className="badge badge-info"><Clock size={11} /> Due: {a.due}</span>
                                    <span className="badge badge-primary"><Users size={11} /> {a.submitted}/{a.total} submitted</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {a.total > 0 ? Math.round((a.submitted / a.total) * 100) : 0}%
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>submitted</div>
                                </div>
                                {expanded === a.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                        </div>
                        <div className="progress-bar" style={{ marginTop: 12 }}>
                            <motion.div className="progress-fill" initial={{ width: 0 }}
                                animate={{ width: `${a.total > 0 ? (a.submitted / a.total) * 100 : 0}%` }} transition={{ duration: 1 }} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {expanded === a.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
                                    <div className="grid-2" style={{ gap: 16 }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Lightbulb size={15} style={{ color: '#f6ad55' }} /> Hints ({a.hints.length})
                                            </div>
                                            {a.hints.map((h, hi) => (
                                                <div key={hi} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f6ad5520', color: '#f6ad55', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{hi + 1}</div>
                                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '2px 0' }}>{h}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {a.submissions.length > 0 ? (
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📥 Submissions</div>
                                                {a.submissions.map((sub, si) => (
                                                    <div key={si} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10, marginBottom: 8 }}>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{sub.name}</div>
                                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub.hints} hint(s) used</div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                            <span style={{ fontWeight: 800, color: sub.score >= 9 ? 'var(--accent-secondary)' : sub.score >= 7 ? '#f6ad55' : 'var(--accent-danger)' }}>{sub.score}/10</span>
                                                            {sub.status === 'flagged' ? <span className="badge badge-danger">Flagged</span> : <span className="badge badge-success"><CheckCircle size={10} /> OK</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: 12, padding: 28 }}>
                                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                                                    <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>No submissions yet
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    )
}
