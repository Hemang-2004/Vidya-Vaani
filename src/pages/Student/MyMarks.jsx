import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { BookOpen, ClipboardList, FlaskConical } from 'lucide-react'

const TOPICS_DATA = [
    { topic: 'Algebra', lecture: 85, assignment: 90, test: 88 },
    { topic: 'Geometry', lecture: 70, assignment: 75, test: 68 },
    { topic: 'Statistics', lecture: 92, assignment: 88, test: 91 },
    { topic: 'Trigonometry', lecture: 60, assignment: 55, test: 50 },
    { topic: 'Calculus', lecture: 40, assignment: 45, test: 38 },
]

const RADAR_DATA = TOPICS_DATA.map(t => ({
    topic: t.topic.slice(0, 5),
    Overall: Math.round((t.lecture + t.assignment + t.test) / 3)
}))

const score_color = (s) => s >= 80 ? 'var(--accent-secondary)' : s >= 60 ? '#f6ad55' : 'var(--accent-danger)'

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null
    return (
        <div style={{ background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', fontSize: 13 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
            {payload.map(p => (
                <div key={p.name} style={{ color: p.fill, marginBottom: 2 }}>{p.name}: {p.value}%</div>
            ))}
        </div>
    )
}

export default function MyMarks() {
    const { t } = useTranslation()
    const [view, setView] = useState('bar')

    const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">📊 {t('s_marks')}</h1>
                <p className="page-subtitle">Topic-wise breakdown of your Lecture, Assignment, and Test scores</p>
            </div>

            {/* Overall avg */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
                {[
                    { label: t('lecture'), icon: BookOpen, color: '#6c63ff', key: 'lecture' },
                    { label: t('assignment'), icon: ClipboardList, color: '#48bb78', key: 'assignment' },
                    { label: t('test'), icon: FlaskConical, color: '#f6ad55', key: 'test' },
                ].map((s, i) => {
                    const v = avg(TOPICS_DATA.map(t => t[s.key]))
                    return (
                        <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}><s.icon size={22} /></div>
                            <div className="stat-number" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}%</div>
                            <div className="stat-label">Avg {s.label}</div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Chart Toggle */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
                {[{ id: 'bar', label: '📊 Bar Chart' }, { id: 'radar', label: '🕸️ Radar' }, { id: 'table', label: '📋 Table' }].map(v => (
                    <button key={v.id} onClick={() => setView(v.id)}
                        style={{
                            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                            background: view === v.id ? 'var(--accent-primary)' : 'transparent',
                            color: view === v.id ? 'white' : 'var(--text-muted)'
                        }}>
                        {v.label}
                    </button>
                ))}
            </div>

            {/* Bar Chart */}
            {view === 'bar' && (
                <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Performance by Topic</h3>
                    <div style={{ width: '100%', height: 340 }}>
                        <ResponsiveContainer>
                            <BarChart data={TOPICS_DATA} barGap={4} barCategoryGap="25%">
                                <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" />
                                <XAxis dataKey="topic" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `${v}%`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 13 }} />
                                <Bar dataKey="lecture" name="Lecture" fill="#6c63ff" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="assignment" name="Assignment" fill="#48bb78" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="test" name="Test" fill="#f6ad55" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Radar Chart */}
            {view === 'radar' && (
                <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Overall Topic Radar</h3>
                    <div style={{ width: '100%', height: 340 }}>
                        <ResponsiveContainer>
                            <RadarChart data={RADAR_DATA}>
                                <PolarGrid stroke="var(--border-color)" />
                                <PolarAngleAxis dataKey="topic" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                                <Radar name="Score" dataKey="Overall" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.25} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* Table */}
            {view === 'table' && (
                <motion.div className="card" style={{ padding: 0, overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>{t('topic')}</th>
                                <th>{t('lecture')}</th>
                                <th>{t('assignment')}</th>
                                <th>{t('test')}</th>
                                <th>Average</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOPICS_DATA.map((row, i) => {
                                const a = avg([row.lecture, row.assignment, row.test])
                                return (
                                    <tr key={i}>
                                        <td><strong>{row.topic}</strong></td>
                                        <td><span style={{ color: score_color(row.lecture), fontWeight: 700 }}>{row.lecture}%</span></td>
                                        <td><span style={{ color: score_color(row.assignment), fontWeight: 700 }}>{row.assignment}%</span></td>
                                        <td><span style={{ color: score_color(row.test), fontWeight: 700 }}>{row.test}%</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 60 }}>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${a}%` }} />
                                                    </div>
                                                </div>
                                                <span style={{ fontWeight: 800, color: score_color(a), fontSize: 14 }}>{a}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    )
}
