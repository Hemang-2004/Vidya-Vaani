import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ZAxis } from 'recharts'
import { TrendingUp, Users, Filter, Info, Zap, Award, BookOpen, Brain } from 'lucide-react'

// All 7 students across 6 quiz sessions, each mapped to difficulty level
const ALL_STUDENTS = [
    { name: 'Arjun', avatar: '🥇', color: '#48bb78', score: 92, rank: 1 },
    { name: 'Priya', avatar: '🥈', color: '#6c63ff', score: 85, rank: 2 },
    { name: 'Vikram', avatar: '🥉', color: '#63b3ed', score: 78, rank: 3 },
    { name: 'Sneha', avatar: '👩‍🎓', color: '#f6ad55', score: 70, rank: 4 },
    { name: 'Rohan', avatar: '👨‍🎓', color: '#9f8fff', score: 88, rank: 5 },
    { name: 'Aditya', avatar: '😊', color: '#fc8181', score: 60, rank: 6 },
    { name: 'Ananya', avatar: '🌟', color: '#68d391', score: 73, rank: 7 },
]

const SESSION_DATA = [
    // [session, difficulty (1=Easy,2=Med,3=Hard,4=Expert), student index]
    { x: 1, y: 1, student: 0, z: 92 },
    { x: 1, y: 1, student: 1, z: 80 },
    { x: 2, y: 1, student: 2, z: 78 },
    { x: 2, y: 2, student: 0, z: 95 },
    { x: 2, y: 2, student: 4, z: 88 },
    { x: 3, y: 2, student: 1, z: 83 },
    { x: 3, y: 2, student: 3, z: 68 },
    { x: 3, y: 3, student: 0, z: 91 },
    { x: 3, y: 3, student: 4, z: 85 },
    { x: 4, y: 2, student: 5, z: 58 },
    { x: 4, y: 3, student: 2, z: 72 },
    { x: 4, y: 3, student: 1, z: 87 },
    { x: 4, y: 3, student: 6, z: 70 },
    { x: 5, y: 2, student: 5, z: 62 },
    { x: 5, y: 3, student: 3, z: 71 },
    { x: 5, y: 4, student: 0, z: 94 },
    { x: 5, y: 4, student: 4, z: 90 },
    { x: 6, y: 3, student: 2, z: 76 },
    { x: 6, y: 3, student: 6, z: 73 },
    { x: 6, y: 4, student: 1, z: 89 },
]

const DIFFICULTY_LABELS = { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Expert' }

const CustomTooltipMap = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0]?.payload
    const student = ALL_STUDENTS[d?.student]
    if (!student) return null
    const scoreColor = d.z >= 80 ? '#48bb78' : d.z >= 65 ? '#f6ad55' : '#fc8181'
    return (
        <div style={{ background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: 160 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{student.avatar}</span>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{student.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rank #{student.rank}</div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Session</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>Quiz {d.x}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Difficulty</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{DIFFICULTY_LABELS[d.y]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor }}>{d.z}%</span>
                </div>
            </div>
        </div>
    )
}

const CustomDot = ({ cx, cy, payload, activeStudent }) => {
    const student = ALL_STUDENTS[payload?.student]
    if (!student) return null
    const isActive = activeStudent === null || activeStudent === payload.student
    const r = payload.z >= 80 ? 18 : payload.z >= 65 ? 16 : 14
    const color = payload.z >= 80 ? '#48bb78' : payload.z >= 65 ? '#f6ad55' : '#fc8181'
    const opacity = isActive ? 1 : 0.15
    return (
        <g style={{ cursor: 'pointer', opacity }}>
            <circle cx={cx} cy={cy} r={r + 6} fill={`${student.color}20`} />
            <circle cx={cx} cy={cy} r={r} fill={`${color}30`} stroke={color} strokeWidth={2.5} />
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight="800" fill={color}>
                {payload.z}
            </text>
        </g>
    )
}

const TOPICS = ['Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Calculus']

export default function AdminLearnerMap() {
    const [activeStudent, setActiveStudent] = useState(null)
    const [filterTopic, setFilterTopic] = useState('All')
    const [hoveredStudent, setHoveredStudent] = useState(null)

    const visibleData = SESSION_DATA.filter(d =>
        activeStudent === null || d.student === activeStudent
    )

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">🗺️ Class Learner Map</h1>
                <p className="page-subtitle">Interactive view of every student's progression through difficulty levels</p>
            </div>

            {/* Legend & filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                    <Filter size={13} style={{ display: 'inline', marginRight: 4 }} />Filter by Topic:
                </span>
                {['All', ...TOPICS].map(t => (
                    <button key={t} onClick={() => setFilterTopic(t)}
                        style={{
                            padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border-color)', fontSize: 12, fontWeight: 600,
                            background: filterTopic === t ? 'var(--accent-primary)' : 'var(--bg-card)',
                            color: filterTopic === t ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit'
                        }}>
                        {t}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20 }}>
                {/* Main Chart */}
                <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
                    {/* Gradient overlays */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16 }}>Student Progression Map</h3>
                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                            {[['#48bb78', '≥80%'], ['#f6ad55', '65–79%'], ['#fc8181', '<65%']].map(([c, l]) => (
                                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                        X → Quiz Sessions over time &nbsp;|&nbsp; Y ↑ Topic Difficulty Level &nbsp;|&nbsp; Bubble = Score %
                    </p>

                    <div style={{ width: '100%', height: 380 }}>
                        <ResponsiveContainer>
                            <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 10 }}>
                                <defs>
                                    <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(108,99,255,0.03)" />
                                        <stop offset="100%" stopColor="rgba(72,187,120,0.03)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" fill="url(#gridGrad)" />
                                <XAxis dataKey="x" type="number" name="Session" domain={[0.5, 6.5]}
                                    ticks={[1, 2, 3, 4, 5, 6]}
                                    tickFormatter={v => `Quiz ${v}`}
                                    label={{ value: 'Quiz Session →', position: 'insideBottom', offset: -14, fill: 'var(--text-muted)', fontSize: 12 }}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                                <YAxis dataKey="y" type="number" name="Difficulty" domain={[0.5, 4.5]}
                                    ticks={[1, 2, 3, 4]} tickFormatter={v => DIFFICULTY_LABELS[v] || ''}
                                    label={{ value: 'Difficulty ↑', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 12, dy: 40 }}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                                <ZAxis dataKey="z" range={[300, 300]} />
                                <Tooltip content={<CustomTooltipMap />} cursor={false} />
                                {/* Zone separator lines */}
                                <ReferenceLine y={1.5} stroke="rgba(72,187,120,0.2)" strokeDasharray="6 4" />
                                <ReferenceLine y={2.5} stroke="rgba(246,173,85,0.25)" strokeDasharray="6 4" />
                                <ReferenceLine y={3.5} stroke="rgba(252,129,129,0.25)" strokeDasharray="6 4" />
                                <ReferenceLine x={3.5} stroke="rgba(108,99,255,0.3)" strokeWidth={2} strokeDasharray="6 4"
                                    label={{ value: 'Midterm', fill: 'var(--accent-primary)', fontSize: 11, dy: -8 }} />
                                <Scatter data={visibleData} shape={(props) => <CustomDot {...props} activeStudent={activeStudent} />} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Zone labels */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                        {[['Easy', 'rgba(72,187,120,0.12)', '#48bb78'], ['Medium', 'rgba(99,179,237,0.12)', '#63b3ed'], ['Hard', 'rgba(246,173,85,0.12)', '#f6ad55'], ['Expert', 'rgba(252,129,129,0.12)', '#fc8181']].map(([l, bg, col]) => (
                            <div key={l} style={{ padding: '4px 12px', borderRadius: 20, background: bg, fontSize: 12, fontWeight: 600, color: col }}>{l} Zone</div>
                        ))}
                    </div>
                </motion.div>

                {/* Student Panel */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--text-primary)' }}>
                        👥 Click to filter
                    </div>
                    <button onClick={() => setActiveStudent(null)}
                        style={{
                            padding: '8px 14px', borderRadius: 10, border: `2px solid ${activeStudent === null ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                            background: activeStudent === null ? 'rgba(108,99,255,0.1)' : 'var(--bg-card)',
                            fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: activeStudent === null ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer'
                        }}>
                        All Students
                    </button>
                    {ALL_STUDENTS.map((s, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveStudent(activeStudent === i ? null : i)}
                            onMouseEnter={() => setHoveredStudent(i)}
                            onMouseLeave={() => setHoveredStudent(null)}
                            style={{
                                padding: '10px 12px', borderRadius: 10, border: `2px solid ${activeStudent === i ? s.color : 'var(--border-color)'}`,
                                background: activeStudent === i ? `${s.color}12` : 'var(--bg-card)',
                                fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 18 }}>{s.avatar}</span>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeStudent === i ? s.color : 'var(--text-primary)' }}>{s.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score: {s.score}%</div>
                                </div>
                                <div style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>#{s.rank}</span>
                                </div>
                            </div>
                            {activeStudent === i && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${s.color}30` }}>
                                    <div className="progress-bar">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 0.6 }}
                                            style={{ height: '100%', borderRadius: 4, background: s.color }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: s.color, marginTop: 4, fontWeight: 700 }}>{s.score}% overall avg</div>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}

                    {/* Class summary */}
                    <div style={{ marginTop: 8, padding: '14px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>CLASS STATS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                { label: 'Class Avg', val: '78%', color: '#6c63ff', icon: '📊' },
                                { label: 'Top Scorer', val: 'Arjun', color: '#48bb78', icon: '🏆' },
                                { label: 'Needs Help', val: 'Aditya', color: '#fc8181', icon: '🆘' },
                            ].map(s => (
                                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{s.icon} {s.label}</span>
                                    <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom insight cards */}
            <div className="grid-3" style={{ marginTop: 20 }}>
                {[
                    { icon: TrendingUp, title: 'Most Improved', desc: 'Rohan jumped from Medium to Hard zone in 3 sessions', color: '#48bb78' },
                    { icon: Brain, title: 'At Risk', desc: 'Aditya is stuck at Easy level — immediate intervention needed', color: '#fc8181' },
                    { icon: Award, title: 'Class Champion', desc: 'Arjun consistently attempts Expert-level problems with 94% accuracy', color: '#f6ad55' },
                ].map((c, i) => (
                    <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                        style={{ borderLeft: `4px solid ${c.color}` }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}18`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <c.icon size={18} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.desc}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
