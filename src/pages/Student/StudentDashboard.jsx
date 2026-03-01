import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { Trophy, BookOpen, Star, TrendingUp, Map, FileText, BarChart3, Lightbulb, Zap, Award } from 'lucide-react'

const STATS = [
    { label: 'Your Rank', value: '#4', icon: Trophy, color: '#f6ad55' },
    { label: 'Topics Mastered', value: '8', icon: Star, color: '#48bb78' },
    { label: 'Assignments Done', value: '12', icon: BookOpen, color: '#6c63ff' },
    { label: 'XP Earned', value: '2,340', icon: Zap, color: '#fc8181' },
]

const CARDS = [
    { to: '/student/learner-map', icon: Map, label: 'Learner Map', desc: 'Practice and level up your quiz skills', color: '#6c63ff' },
    { to: '/student/summary', icon: FileText, label: 'Upload Summary', desc: 'Submit post-lecture learning notes', color: '#48bb78' },
    { to: '/student/marks', icon: BarChart3, label: 'My Marks', desc: 'Topic-wise performance breakdown', color: '#f6ad55' },
    { to: '/student/insights', icon: Lightbulb, label: 'Topic Insights', desc: 'Know your strong & weak topics', color: '#fc8181' },
]

const RECENT = [
    { icon: '📝', action: 'Assignment 3 Graded', detail: '9/10 marks • 0 hints used', time: '2h ago', color: '#48bb78' },
    { icon: '🎓', action: 'Lecture 8 Available', detail: 'Trigonometry: Basics', time: '5h ago', color: '#6c63ff' },
    { icon: '⚡', action: 'Quiz Completed', detail: 'Algebra • Score: 85%', time: '1d ago', color: '#f6ad55' },
    { icon: '🏆', action: 'Level Up!', detail: 'You reached Rank #4 in class', time: '2d ago', color: '#fc8181' },
]

export default function StudentDashboard() {
    const { user } = useAuth()

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">Hey, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="page-subtitle">Ready to learn something awesome today?</p>
            </div>

            {/* XP Banner */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 24, padding: '20px 24px', borderRadius: 20, background: 'var(--gradient-primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Your Progress This Week</div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>2,340 XP Earned 🚀</div>
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>660 XP to reach Rank #3!</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, minWidth: 160 }}>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>Level Progress: 78%</div>
                    <div style={{ width: 160, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.25)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1.2 }}
                            style={{ height: '100%', borderRadius: 4, background: 'white' }} />
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>Adventurer → Expert</div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
                {STATS.map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}><s.icon size={22} /></div>
                        <div className="stat-number" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid-2">
                {/* Quick Nav */}
                <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Quick Navigate</h3>
                    <div className="grid-2" style={{ gap: 10 }}>
                        {CARDS.map((c, i) => (
                            <Link key={i} to={c.to} style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ scale: 1.03, y: -2 }}
                                    style={{ padding: '16px', borderRadius: 12, background: `${c.color}10`, border: `1px solid ${c.color}25`, cursor: 'pointer' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}18`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                        <c.icon size={18} />
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{c.label}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{c.desc}</div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Recent Updates</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {RECENT.map((r, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.action}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.detail}</div>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.time}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
