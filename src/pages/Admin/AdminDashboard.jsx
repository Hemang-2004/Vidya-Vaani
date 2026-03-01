import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Upload, ClipboardList, Trophy, Pencil, Users, TrendingUp, BookOpen, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import '../Admin/Layouts.css'

const STATS = [
    { label: 'Total Students', value: '42', icon: Users, color: '#6c63ff', sub: '+3 this week' },
    { label: 'Lectures Uploaded', value: '18', icon: Upload, color: '#48bb78', sub: '4 this month' },
    { label: 'Assignments Active', value: '5', icon: ClipboardList, color: '#f6ad55', sub: '2 due this week' },
    { label: 'Avg Class Score', value: '74%', icon: TrendingUp, color: '#fc8181', sub: '↑ 6% from last test' },
]

const RECENT = [
    { student: 'Arjun Mehta', action: 'Submitted Assignment 3', time: '2h ago', status: 'success' },
    { student: 'Priya Nair', action: 'Missed Lecture 7', time: '4h ago', status: 'danger' },
    { student: 'Rohan Das', action: 'Completed Quiz (Score: 88%)', time: '6h ago', status: 'info' },
    { student: 'Sneha Patel', action: 'Copied Submission Flagged', time: '8h ago', status: 'danger' },
    { student: 'Vikram Rao', action: 'Uploaded Summary for Lecture 7', time: '1d ago', status: 'success' },
]

const QUICK_LINKS = [
    { to: '/admin/upload', icon: Upload, label: 'Upload Lecture', color: '#6c63ff' },
    { to: '/admin/assignments', icon: ClipboardList, label: 'New Assignment', color: '#48bb78' },
    { to: '/admin/rankings', icon: Trophy, label: 'Class Rankings', color: '#f6ad55' },
    { to: '/admin/quiz', icon: Pencil, label: 'Create Quiz', color: '#fc8181' },
]

export default function AdminDashboard() {
    const { user } = useAuth()
    const { t } = useTranslation()

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="page-subtitle">Here's what's happening in your class today</p>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 28 }}>
                {STATS.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}><s.icon size={22} /></div>
                        <div className="stat-number" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid-2">
                {/* Recent Activity */}
                <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16 }}>Recent Activity</h3>
                        <span className="badge badge-primary">Live</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {RECENT.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div className={`badge badge-${r.status}`} style={{ width: 8, height: 8, borderRadius: '50%', padding: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.student}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.action}</div>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.time}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Quick Actions</h3>
                    <div className="grid-2" style={{ gap: 12 }}>
                        {QUICK_LINKS.map((ql, i) => (
                            <Link key={i} to={ql.to} style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ scale: 1.03, y: -2 }}
                                    style={{
                                        padding: '20px 16px', borderRadius: 14, background: `${ql.color}12`,
                                        border: `1px solid ${ql.color}30`, display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: 10, cursor: 'pointer'
                                    }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ql.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ql.color }}>
                                        <ql.icon size={22} />
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{ql.label}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                    {/* Attendance Summary */}
                    <div style={{ marginTop: 20, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Today's Attendance</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Present</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>36 / 42</span>
                        </div>
                        <div className="progress-bar">
                            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.6 }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>5 students have yet to watch the recorded lecture</div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
