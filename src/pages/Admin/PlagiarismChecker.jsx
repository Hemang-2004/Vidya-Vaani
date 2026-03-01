import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Eye, Flag, User } from 'lucide-react'

const SUBMISSIONS = [
    { id: 1, student: 'Sneha Patel', assignment: 'Quadratic Equations Set', similarity: 87, matchedWith: 'Rohan Kumar', status: 'flagged', submitted: '2h ago', excerpt: '...solving by completing the square gives us x = (−b ± √D) / 2a where D = b² − 4ac...' },
    { id: 2, student: 'Aditya Verma', assignment: 'Quadratic Equations Set', similarity: 92, matchedWith: 'Priya Sharma (external)', status: 'flagged', submitted: '3h ago', excerpt: '...the discriminant helps determine the nature of roots. If D > 0, two real roots exist...' },
    { id: 3, student: 'Arjun Mehta', assignment: 'Quadratic Equations Set', similarity: 12, matchedWith: null, status: 'clear', submitted: '4h ago', excerpt: '...I approached this by first factoring the equation, then verifying with the formula...' },
    { id: 4, student: 'Priya Nair', assignment: 'Coordinate Geometry', similarity: 5, matchedWith: null, status: 'clear', submitted: '5h ago', excerpt: '...' },
    { id: 5, student: 'Vikram Rao', assignment: 'Coordinate Geometry', similarity: 67, matchedWith: 'Sneha Patel', status: 'review', submitted: '6h ago', excerpt: '...using the midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2)...' },
]

const SIM_COLOR = (v) => v >= 70 ? 'var(--accent-danger)' : v >= 40 ? '#f6ad55' : 'var(--accent-secondary)'
const SIM_BG = (v) => v >= 70 ? 'rgba(252,129,129,0.1)' : v >= 40 ? 'rgba(246,173,85,0.1)' : 'rgba(72,187,120,0.1)'

export default function PlagiarismChecker() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const filtered = SUBMISSIONS.filter(s =>
        (filter === 'all' || s.status === filter) &&
        (s.student.toLowerCase().includes(search.toLowerCase()) || s.assignment.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">🛡️ Plagiarism Checker</h1>
                <p className="page-subtitle">AI-powered originality checker — flagged submissions are automatically detected</p>
            </div>

            {/* Summary Cards */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Total Checked', value: SUBMISSIONS.length, icon: ShieldAlert, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
                    { label: 'Flagged', value: SUBMISSIONS.filter(s => s.status === 'flagged').length, icon: AlertTriangle, color: '#fc8181', bg: 'rgba(252,129,129,0.1)' },
                    { label: 'Clear', value: SUBMISSIONS.filter(s => s.status === 'clear').length, icon: CheckCircle, color: '#48bb78', bg: 'rgba(72,187,120,0.1)' },
                ].map((c, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                            <c.icon size={22} />
                        </div>
                        <div style={{ fontSize: 30, fontWeight: 900, color: c.color }}>{c.value}</div>
                        <div className="stat-label">{c.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36, width: '100%' }} placeholder="Search student or assignment..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                {['all', 'flagged', 'review', 'clear'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border-color)', background: filter === f ? 'var(--accent-primary)' : 'var(--bg-card)', color: filter === f ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Submission List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((sub, i) => (
                    <motion.div key={sub.id} className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                            {/* Student */}
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 200 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gradient-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{sub.student}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub.assignment} • {sub.submitted}</div>
                                </div>
                            </div>

                            {/* Similarity Meter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 140 }}>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Similarity Score</div>
                                    <div className="progress-bar">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${sub.similarity}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                                            style={{ height: '100%', borderRadius: 4, background: SIM_COLOR(sub.similarity) }} />
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: SIM_COLOR(sub.similarity), marginTop: 2 }}>{sub.similarity}%</div>
                                </div>
                            </div>

                            {/* Status */}
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                {sub.status === 'flagged' && <span className="badge badge-danger"><Flag size={11} /> Flagged</span>}
                                {sub.status === 'review' && <span className="badge badge-warning"><Eye size={11} /> Review</span>}
                                {sub.status === 'clear' && <span className="badge badge-success"><CheckCircle size={11} /> Clear</span>}
                            </div>
                        </div>

                        {/* Matched with + excerpt */}
                        {sub.matchedWith && (
                            <div style={{ marginTop: 14, padding: '12px 16px', background: SIM_BG(sub.similarity), borderRadius: 10, borderLeft: `3px solid ${SIM_COLOR(sub.similarity)}` }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: SIM_COLOR(sub.similarity), marginBottom: 6 }}>
                                    ⚠️ Matched with: {sub.matchedWith}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>"{sub.excerpt}"</div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
