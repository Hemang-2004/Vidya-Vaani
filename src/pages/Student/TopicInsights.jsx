import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, BookOpen, Target, Lightbulb } from 'lucide-react'

const TOPICS = [
    { name: 'Algebra', avg: 88, status: 'good', trend: +5, advice: 'Keep up the great work! Challenge yourself with harder problems.', emoji: '🔢', color: '#48bb78' },
    { name: 'Statistics', avg: 90, status: 'excellent', trend: +8, advice: 'Outstanding! You are ready for advanced statistical concepts.', emoji: '📊', color: '#48bb78' },
    { name: 'Geometry', avg: 71, status: 'good', trend: +2, advice: "Good progress! Focus on 3D geometry and construction problems.", emoji: '📐', color: '#f6ad55' },
    { name: 'Trigonometry', avg: 55, status: 'needs_work', trend: -3, advice: 'Review unit circle, SOH-CAH-TOA, and basic identities. Watch Lecture 6 again.', emoji: '📏', color: '#fc8181' },
    { name: 'Calculus', avg: 41, status: 'needs_work', trend: -8, advice: 'Critical area! Focus on limits first, then derivatives. Use the hint system for extra support.', emoji: '∫', color: '#fc8181' },
]

const STATUS_MAP = {
    excellent: { label: 'Excellent', badge: 'badge-success', icon: ThumbsUp },
    good: { label: 'Good', badge: 'badge-info', icon: TrendingUp },
    needs_work: { label: 'Needs Work', badge: 'badge-danger', icon: ThumbsDown }
}

export default function TopicInsights() {
    const { t } = useTranslation()
    const good = TOPICS.filter(t => t.status !== 'needs_work')
    const weak = TOPICS.filter(t => t.status === 'needs_work')

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">💡 {t('s_insights')}</h1>
                <p className="page-subtitle">AI-powered analysis of your strengths and areas that need attention</p>
            </div>

            {/* Summary Banners */}
            <div className="grid-2" style={{ marginBottom: 28 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ padding: '20px 24px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(72,187,120,0.12), rgba(72,187,120,0.04))', border: '1px solid rgba(72,187,120,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <ThumbsUp size={20} style={{ color: 'var(--accent-secondary)' }} />
                        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent-secondary)' }}>Your Strengths</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        You're performing well in <strong>{good.map(g => g.name).join(', ')}</strong>. These form a strong foundation!
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ padding: '20px 24px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(252,129,129,0.12), rgba(252,129,129,0.04))', border: '1px solid rgba(252,129,129,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Target size={20} style={{ color: 'var(--accent-danger)' }} />
                        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent-danger)' }}>Focus Areas</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        <strong>{weak.map(w => w.name).join(' & ')}</strong> need attention. Use the hint system and re-watch lectures.
                    </p>
                </motion.div>
            </div>

            {/* Good Topics */}
            <h3 className="section-heading" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThumbsUp size={18} style={{ color: 'var(--accent-secondary)' }} /> Strong Topics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {good.map((topic, i) => {
                    const S = STATUS_MAP[topic.status]
                    return (
                        <motion.div key={topic.name} className="card" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            style={{ borderLeft: `4px solid ${topic.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${topic.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                    {topic.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>{topic.name}</span>
                                        <span className={`badge ${S.badge}`}><S.icon size={11} /> {t(topic.status)}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: topic.trend > 0 ? 'var(--accent-secondary)' : 'var(--accent-danger)' }}>
                                            {topic.trend > 0 ? '↑' : '↓'} {Math.abs(topic.trend)}%
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: 10 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Average Score</span>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: topic.color }}>{topic.avg}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${topic.avg}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                                style={{ height: '100%', borderRadius: 4, background: topic.color }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 10 }}>
                                        <Lightbulb size={14} style={{ color: topic.color, flexShrink: 0 }} />
                                        {topic.advice}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Weak Topics */}
            <h3 className="section-heading" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={18} style={{ color: 'var(--accent-danger)' }} /> Focus Areas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {weak.map((topic, i) => {
                    const S = STATUS_MAP[topic.status]
                    return (
                        <motion.div key={topic.name} className="card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                            style={{ borderLeft: `4px solid ${topic.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${topic.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                    {topic.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, fontSize: 16 }}>{topic.name}</span>
                                        <span className={`badge ${S.badge}`}><S.icon size={11} /> {t(topic.status)}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-danger)' }}>↓ {Math.abs(topic.trend)}%</span>
                                    </div>
                                    <div style={{ marginBottom: 10 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Average Score</span>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: topic.color }}>{topic.avg}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${topic.avg}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                                style={{ height: '100%', borderRadius: 4, background: topic.color }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'start', fontSize: 13, color: 'var(--text-secondary)', background: 'rgba(252,129,129,0.08)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(252,129,129,0.2)' }}>
                                        <Lightbulb size={14} style={{ color: '#f6ad55', flexShrink: 0, marginTop: 2 }} />
                                        {topic.advice}
                                    </div>
                                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <a href="#" className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}><BookOpen size={13} /> Re-watch Lecture</a>
                                        <a href="#" className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}><Target size={13} /> Practice Quiz</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
