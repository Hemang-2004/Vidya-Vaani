import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Save, Pencil } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

const TOPICS = ['Algebra', 'Geometry', 'Statistics', 'Trigonometry', 'Calculus']
const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Expert']

const SAMPLE_MAP_DATA = [
    { x: 1, y: 1, name: 'Arjun', score: 92 },
    { x: 2, y: 2, name: 'Priya', score: 85 },
    { x: 2, y: 1, name: 'Vikram', score: 78 },
    { x: 3, y: 2, name: 'Sneha', score: 70 },
    { x: 3, y: 3, name: 'Rohan', score: 88 },
    { x: 4, y: 2, name: 'Aditya', score: 60 },
    { x: 4, y: 3, name: 'Ananya', score: 73 },
    { x: 5, y: 3, name: 'Raj', score: 55 },
    { x: 5, y: 4, name: 'Meera', score: 90 },
    { x: 6, y: 4, name: 'Kabir', score: 82 },
]

const CustomDot = ({ cx, cy, payload }) => {
    const r = 18
    const color = payload.score >= 80 ? '#48bb78' : payload.score >= 65 ? '#f6ad55' : '#fc8181'
    return (
        <g>
            <circle cx={cx} cy={cy} r={r} fill={`${color}30`} stroke={color} strokeWidth={2} />
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight="700" fill={color}>{payload.name.split('')[0]}</text>
        </g>
    )
}

export default function QuizMaker() {
    const { t } = useTranslation()
    const [questions, setQuestions] = useState([
        { id: 1, q: 'Solve: 2x² − 5x + 3 = 0', type: 'mcq', topic: 'Algebra', difficulty: 'Medium', options: ['x=1, x=1.5', 'x=2, x=3', 'x=−1, x=2', 'No real roots'], correct: 0 },
        { id: 2, q: 'Find the distance between (3,4) and (0,0)', type: 'short', topic: 'Geometry', difficulty: 'Easy', options: [], correct: null },
    ])
    const [tab, setTab] = useState('builder')

    const addQ = () => setQuestions(qs => [...qs, { id: Date.now(), q: '', type: 'mcq', topic: TOPICS[0], difficulty: 'Easy', options: ['', '', '', ''], correct: 0 }])
    const removeQ = (id) => setQuestions(qs => qs.filter(q => q.id !== id))

    return (
        <div className="page-content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">🎯 {t('a_quiz')}</h1>
                    <p className="page-subtitle">Create quizzes and visualize student progress on the learner map</p>
                </div>
                <button className="btn-primary"><Save size={16} /> Publish Quiz</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, width: 'fit-content' }}>
                {[{ id: 'builder', label: '🔨 Quiz Builder' }, { id: 'map', label: '🗺️ Learner Map' }].map(tb => (
                    <button key={tb.id} onClick={() => setTab(tb.id)}
                        style={{
                            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                            background: tab === tb.id ? 'var(--accent-primary)' : 'transparent',
                            color: tab === tb.id ? 'white' : 'var(--text-muted)'
                        }}>
                        {tb.label}
                    </button>
                ))}
            </div>

            {tab === 'builder' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Quiz Meta */}
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Quiz Details</h3>
                        <div className="grid-3" style={{ gap: 14 }}>
                            <div className="form-group">
                                <label className="form-label">Quiz Title</label>
                                <input className="form-input" defaultValue="Mid-term Practice Quiz" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time Limit</label>
                                <input className="form-input" type="number" defaultValue={30} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Due Date</label>
                                <input className="form-input" type="date" />
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    {questions.map((q, qi) => (
                        <motion.div key={q.id} className="card" style={{ marginBottom: 16 }}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.08 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <span className="badge badge-primary">Q{qi + 1}</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <span className="badge badge-info">{q.difficulty}</span>
                                    <span className="badge badge-primary">{q.topic}</span>
                                    <button onClick={() => removeQ(q.id)} style={{ color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 14 }}>
                                <label className="form-label">Question</label>
                                <input className="form-input" defaultValue={q.q} placeholder="Type your question..." />
                            </div>
                            <div className="grid-3" style={{ gap: 12, marginBottom: 14 }}>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select className="form-input"><option>Multiple Choice</option><option>Short Answer</option></select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Topic</label>
                                    <select className="form-input">{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Difficulty</label>
                                    <select className="form-input">{DIFFICULTY.map(d => <option key={d}>{d}</option>)}</select>
                                </div>
                            </div>
                            {q.type === 'mcq' && q.options.length > 0 && (
                                <div className="grid-2" style={{ gap: 10 }}>
                                    {q.options.map((opt, oi) => (
                                        <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <input type="radio" name={`q${q.id}`} defaultChecked={oi === q.correct} />
                                            <input className="form-input" defaultValue={opt} style={{ flex: 1, padding: '8px 12px', fontSize: 13 }} placeholder={`Option ${oi + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}

                    <button className="btn-secondary" onClick={addQ}><Plus size={16} /> Add Question</button>
                </motion.div>
            )}

            {tab === 'map' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 6 }}>📊 Learner Performance Map</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
                            X-axis: Time → (Quiz Sessions) &nbsp;|&nbsp; Y-axis: Topic Difficulty Level
                        </p>
                        <div style={{ width: '100%', height: 380 }}>
                            <ResponsiveContainer>
                                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                                    <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" />
                                    <XAxis dataKey="x" type="number" name="Time" label={{ value: 'Quiz Session →', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 7]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <YAxis dataKey="y" type="number" name="Difficulty" ticks={[1, 2, 3, 4]} tickFormatter={(v) => ['', 'Easy', 'Med', 'Hard', 'Expert'][v]} label={{ value: 'Difficulty ↑', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 12 }} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 5]} />
                                    <Tooltip content={({ payload }) => {
                                        if (!payload?.length) return null
                                        const d = payload[0]?.payload
                                        return <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', fontSize: 13 }}>
                                            <div style={{ fontWeight: 700 }}>{d?.name}</div>
                                            <div style={{ color: 'var(--text-muted)' }}>Score: {d?.score}%</div>
                                        </div>
                                    }} />
                                    <Scatter data={SAMPLE_MAP_DATA} shape={<CustomDot />} />
                                    <ReferenceLine x={3.5} stroke="rgba(108,99,255,0.3)" strokeDasharray="6 4" label={{ value: 'Now', fill: 'var(--accent-primary)', fontSize: 12 }} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                            {[['#48bb78', 'Score ≥ 80%'], ['#f6ad55', 'Score 65–79%'], ['#fc8181', 'Score < 65%']].map(([c, l]) => (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />{l}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
