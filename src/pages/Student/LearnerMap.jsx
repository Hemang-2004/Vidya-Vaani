import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Star, Lock, CheckCircle, Trophy, TrendingUp, X, ArrowRight } from 'lucide-react'

// Adventure zone definitions
const ZONES = [
    { id: 'algebra', name: 'Algebra Kingdom', emoji: '🏰', level: 3, xp: 450, maxXp: 500, status: 'mastered', color: '#48bb78', bg: 'linear-gradient(135deg,#48bb78,#68d391)', desc: 'Equations, factoring & quadratics', mapPos: { x: 15, y: 65 } },
    { id: 'geometry', name: 'Geometry Realm', emoji: '⛰️', level: 2, xp: 310, maxXp: 400, status: 'progress', color: '#6c63ff', bg: 'linear-gradient(135deg,#6c63ff,#9f8fff)', desc: 'Coordinates, shapes & proofs', mapPos: { x: 42, y: 38 } },
    { id: 'stats', name: 'Statistics Sea', emoji: '🌊', level: 1, xp: 120, maxXp: 300, status: 'progress', color: '#63b3ed', bg: 'linear-gradient(135deg,#63b3ed,#90cdf4)', desc: 'Data, probability & distributions', mapPos: { x: 65, y: 58 } },
    { id: 'trig', name: 'Trig Temple', emoji: '🏛️', level: 0, xp: 0, maxXp: 300, status: 'unlocked', color: '#f6ad55', bg: 'linear-gradient(135deg,#f6ad55,#fbd38d)', desc: 'Sine, cosine & identities', mapPos: { x: 78, y: 28 } },
    { id: 'calculus', name: 'Calculus Peak', emoji: '🗻', level: 0, xp: 0, maxXp: 400, status: 'locked', color: '#9f8fff', bg: 'linear-gradient(135deg,#9f8fff,#b794f4)', desc: 'Limits, derivatives & integrals', mapPos: { x: 55, y: 15 } },
    { id: 'prob', name: 'Probability Palace', emoji: '🎲', level: 0, xp: 0, maxXp: 350, status: 'locked', color: '#fc8181', bg: 'linear-gradient(135deg,#fc8181,#feb2b2)', desc: 'Combinatorics & chance', mapPos: { x: 30, y: 20 } },
]

const PATHS = [
    { from: 'algebra', to: 'geometry' }, { from: 'geometry', to: 'stats' },
    { from: 'stats', to: 'trig' }, { from: 'geometry', to: 'prob' },
    { from: 'trig', to: 'calculus' }, { from: 'prob', to: 'calculus' },
]

const QUIZ_Q = [
    { q: 'Solve: 2x² − 5x + 3 = 0', opts: ['x=1, x=1.5', 'x=2, x=3', 'x=−1, x=2', 'No real roots'], ans: 0 },
    { q: 'Simplify: (3x + 2)(x − 4)', opts: ['3x²−10x−8', '3x²+10x−8', '3x²−10x+8', 'x²−10x−8'], ans: 0 },
    { q: 'Factor: x² − 9', opts: ['(x+3)(x−3)', '(x+9)(x−1)', '(x−3)²', 'x(x−9)'], ans: 0 },
]

const STATUS_ICON = { mastered: '✅', progress: '⚡', unlocked: '🔓', locked: '🔒' }

export default function LearnerMap() {
    const [view, setView] = useState('map') // 'map' | 'quiz' | 'zone'
    const [selected, setSelected] = useState(null)
    const [particles, setParticles] = useState([])
    const [qIdx, setQIdx] = useState(0)
    const [answered, setAnswered] = useState(null)
    const [correct, setCorrect] = useState(0)
    const [done, setDone] = useState(false)
    const [showXPPop, setShowXPPop] = useState(false)

    const totalXP = ZONES.reduce((s, z) => s + z.xp, 0)
    const mastered = ZONES.filter(z => z.status === 'mastered').length
    const selectedZone = ZONES.find(z => z.id === selected)

    const spawnParticles = (cx, cy) => {
        const ps = Array.from({ length: 10 }, (_, i) => ({
            id: Date.now() + i, cx, cy,
            angle: (i / 10) * 360, dist: 40 + Math.random() * 30,
            color: ['#f6ad55', '#48bb78', '#6c63ff', '#fc8181'][i % 4]
        }))
        setParticles(ps)
        setTimeout(() => setParticles([]), 900)
    }

    const handleAnswer = (i, e) => {
        if (answered !== null) return
        setAnswered(i)
        if (i === QUIZ_Q[qIdx].ans) {
            setCorrect(c => c + 1)
            spawnParticles(e.clientX, e.clientY)
        }
        setTimeout(() => {
            if (qIdx + 1 < QUIZ_Q.length) { setQIdx(q => q + 1); setAnswered(null) }
            else { setDone(true); setShowXPPop(true) }
        }, 900)
    }

    const resetQuiz = () => { setView('map'); setQIdx(0); setAnswered(null); setCorrect(0); setDone(false); setShowXPPop(false) }

    const openZone = (z) => { if (z.status === 'locked') return; setSelected(z.id); setView('zone') }
    const startQuiz = () => { setView('quiz'); setQIdx(0); setAnswered(null); setCorrect(0); setDone(false) }

    return (
        <div className="page-content" style={{ position: 'relative' }}>
            {/* Particle burst */}
            {particles.map(p => (
                <motion.div key={p.id} style={{ position: 'fixed', zIndex: 9999, width: 10, height: 10, borderRadius: '50%', background: p.color, left: p.cx, top: p.cy, pointerEvents: 'none' }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.dist, y: Math.sin(p.angle * Math.PI / 180) * p.dist, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8 }} />
            ))}

            <div className="page-header">
                <h1 className="page-title">🗺️ Learner Adventure Map</h1>
                <p className="page-subtitle">Explore zones, earn XP, and level up your knowledge!</p>
            </div>

            {/* XP Stats */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Total XP', value: totalXP.toLocaleString(), icon: Zap, color: '#f6ad55', suffix: ' XP' },
                    { label: 'Zones Mastered', value: `${mastered}/6`, icon: Trophy, color: '#48bb78', suffix: '' },
                    { label: 'Current Streak', value: '🔥 7', icon: Star, color: '#fc8181', suffix: ' days' },
                ].map((s, i) => (
                    <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}><s.icon size={22} /></div>
                        <div className="stat-number" style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}{s.suffix}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ===== MAP VIEW ===== */}
                {view === 'map' && (
                    <motion.div key="map" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                        {/* SVG Adventure Map */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: 420, background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0d2139 100%)' }}>
                            {/* Star background */}
                            {Array.from({ length: 30 }, (_, i) => (
                                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                                    style={{
                                        position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: 'white',
                                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, pointerEvents: 'none'
                                    }} />
                            ))}

                            {/* SVG paths */}
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                {PATHS.map((p, i) => {
                                    const from = ZONES.find(z => z.id === p.from)?.mapPos
                                    const to = ZONES.find(z => z.id === p.to)?.mapPos
                                    if (!from || !to) return null
                                    const bothUnlocked = ZONES.find(z => z.id === p.from)?.status !== 'locked' && ZONES.find(z => z.id === p.to)?.status !== 'locked'
                                    return (
                                        <motion.line key={i}
                                            x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
                                            stroke={bothUnlocked ? 'rgba(108,99,255,0.6)' : 'rgba(255,255,255,0.1)'}
                                            strokeWidth={bothUnlocked ? 2.5 : 1.5} strokeDasharray="8 4"
                                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.15 }} />
                                    )
                                })}
                            </svg>

                            {/* Zone nodes */}
                            {ZONES.map((z, i) => (
                                <motion.div key={z.id}
                                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                                    style={{ position: 'absolute', left: `${z.mapPos.x}%`, top: `${z.mapPos.y}%`, transform: 'translate(-50%,-50%)', zIndex: 2 }}>
                                    <motion.div
                                        whileHover={z.status !== 'locked' ? { scale: 1.18, y: -6 } : {}}
                                        whileTap={z.status !== 'locked' ? { scale: 0.94 } : {}}
                                        onClick={() => openZone(z)}
                                        style={{ cursor: z.status !== 'locked' ? 'pointer' : 'not-allowed', textAlign: 'center' }}>
                                        {/* Pulse ring for unlocked/progress */}
                                        {(z.status === 'unlocked' || z.status === 'progress') && (
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                                                style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `2px solid ${z.color}`, pointerEvents: 'none' }} />
                                        )}
                                        {/* Node Circle */}
                                        <div style={{
                                            width: 64, height: 64, borderRadius: '50%', background: z.status === 'locked' ? 'rgba(255,255,255,0.08)' : z.bg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                                            boxShadow: z.status !== 'locked' ? `0 0 20px ${z.color}60, 0 4px 14px rgba(0,0,0,0.4)` : 'none',
                                            border: `3px solid ${z.status !== 'locked' ? z.color : 'rgba(255,255,255,0.15)'}`,
                                            filter: z.status === 'locked' ? 'grayscale(1) brightness(0.5)' : 'none'
                                        }}>
                                            {z.status === 'locked' ? '🔒' : z.emoji}
                                        </div>
                                        {/* Mastered crown */}
                                        {z.status === 'mastered' && (
                                            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 16 }}>👑</div>
                                        )}
                                        {/* Name badge */}
                                        <div style={{
                                            marginTop: 6, fontSize: 11, fontWeight: 700, color: z.status !== 'locked' ? z.color : 'rgba(255,255,255,0.3)',
                                            background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 8, whiteSpace: 'nowrap'
                                        }}>
                                            {z.name.split(' ')[0]}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}

                            {/* XP progress at bottom */}
                            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>⚡ Total Progress</span>
                                    <span style={{ fontSize: 12, color: '#f6ad55', fontWeight: 700 }}>{totalXP} / 2250 XP</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(totalXP / 2250) * 100}%` }} transition={{ duration: 1.5 }}
                                        style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6c63ff, #48bb78)' }} />
                                </div>
                            </div>
                        </div>

                        {/* Zone list below map */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                            {ZONES.map((z, i) => (
                                <motion.div key={z.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                                    onClick={() => openZone(z)}
                                    style={{
                                        padding: '14px 18px', borderRadius: 14, cursor: z.status !== 'locked' ? 'pointer' : 'default',
                                        border: `2px solid ${z.status !== 'locked' ? z.color + '40' : 'var(--border-color)'}`,
                                        background: z.status !== 'locked' ? `${z.color}08` : 'var(--bg-secondary)',
                                        opacity: z.status === 'locked' ? 0.55 : 1, transition: 'all 0.2s'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            fontSize: 26, width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: z.status !== 'locked' ? `${z.color}18` : 'var(--border-color)'
                                        }}>
                                            {STATUS_ICON[z.status]}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontWeight: 700, fontSize: 15 }}>{z.name}</span>
                                                {z.status === 'mastered' && <span className="badge badge-success">Mastered!</span>}
                                                {z.status === 'progress' && <span className="badge badge-info"><TrendingUp size={10} /> Level {z.level}</span>}
                                                {z.status === 'unlocked' && <span className="badge badge-warning">Start!</span>}
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: z.status !== 'locked' ? 6 : 0 }}>{z.desc}</div>
                                            {z.status !== 'locked' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="progress-bar">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${(z.xp / z.maxXp) * 100}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                                                style={{ height: '100%', borderRadius: 4, background: z.color }} />
                                                        </div>
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: z.color, whiteSpace: 'nowrap' }}>{z.xp}/{z.maxXp} XP</span>
                                                </div>
                                            )}
                                        </div>
                                        {z.status !== 'locked' && <ArrowRight size={16} style={{ color: z.color, flexShrink: 0 }} />}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ===== ZONE DETAIL VIEW ===== */}
                {view === 'zone' && selectedZone && (
                    <motion.div key="zone" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <button onClick={() => setView('map')} className="btn-secondary" style={{ marginBottom: 20, fontSize: 13 }}>← Back to Map</button>
                        <div className="card" style={{ background: `linear-gradient(135deg, ${selectedZone.color}12, ${selectedZone.color}05)`, border: `2px solid ${selectedZone.color}30`, marginBottom: 20 }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                                <div style={{ width: 64, height: 64, borderRadius: 20, background: selectedZone.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: `0 4px 20px ${selectedZone.color}50` }}>
                                    {selectedZone.emoji}
                                </div>
                                <div>
                                    <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{selectedZone.name}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{selectedZone.desc}</p>
                                </div>
                            </div>
                            <div className="grid-3" style={{ gap: 12, marginBottom: 20 }}>
                                {[
                                    { label: 'Level', value: selectedZone.level || '—', color: selectedZone.color },
                                    { label: 'XP', value: `${selectedZone.xp}/${selectedZone.maxXp}`, color: '#f6ad55' },
                                    { label: 'Status', value: selectedZone.status === 'mastered' ? '✅ Done' : selectedZone.status === 'progress' ? '⚡ Active' : '🔓 New', color: '#48bb78' },
                                ].map((s, i) => (
                                    <div key={i} style={{ textAlign: 'center', padding: '14px', borderRadius: 12, background: 'var(--bg-secondary)' }}>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>Zone Progress</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: selectedZone.color }}>{Math.round((selectedZone.xp / selectedZone.maxXp) * 100)}%</span>
                                </div>
                                <div style={{ height: 10, borderRadius: 5, background: 'var(--border-color)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(selectedZone.xp / selectedZone.maxXp) * 100}%` }} transition={{ duration: 1.2 }}
                                        style={{ height: '100%', borderRadius: 5, background: selectedZone.bg }} />
                                </div>
                            </div>
                            <motion.button className="btn-primary" onClick={startQuiz} whileTap={{ scale: 0.97 }}
                                style={{ background: selectedZone.bg, width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }}>
                                <Zap size={18} /> Start Practice Quiz — Earn +225 XP
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* ===== QUIZ VIEW ===== */}
                {view === 'quiz' && (
                    <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <div className="card">
                            {!done ? (
                                <>
                                    {/* Quiz header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span className="badge badge-primary">Q{qIdx + 1}/{QUIZ_Q.length}</span>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {QUIZ_Q.map((_, i) => (
                                                    <div key={i} style={{ width: 28, height: 4, borderRadius: 2, background: i <= qIdx ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'background 0.3s' }} />
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => setView('zone')} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                                            <X size={14} /> Exit
                                        </button>
                                    </div>

                                    <motion.div key={qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 28, lineHeight: 1.5 }}>{QUIZ_Q[qIdx].q}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {QUIZ_Q[qIdx].opts.map((opt, i) => {
                                                const isCorrect = i === QUIZ_Q[qIdx].ans
                                                const isSelected = answered === i
                                                let bg = 'var(--bg-secondary)', border = 'var(--border-color)', color = 'var(--text-primary)'
                                                if (answered !== null) {
                                                    if (isCorrect) { bg = 'rgba(72,187,120,0.12)'; border = '#48bb78'; color = '#48bb78' }
                                                    else if (isSelected) { bg = 'rgba(252,129,129,0.12)'; border = '#fc8181'; color = '#fc8181' }
                                                }
                                                return (
                                                    <motion.button key={i} whileTap={answered === null ? { scale: 0.98 } : {}}
                                                        onClick={(e) => handleAnswer(i, e)}
                                                        style={{
                                                            padding: '14px 18px', borderRadius: 12, border: `2px solid ${border}`, textAlign: 'left',
                                                            cursor: answered === null ? 'pointer' : 'default', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                                                            background: bg, color, transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 12
                                                        }}>
                                                        <span style={{ width: 28, height: 28, borderRadius: '50%', background: answered !== null && isCorrect ? '#48bb78' : 'var(--bg-card)', color: answered !== null && isCorrect ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0, border: '1px solid var(--border-color)', transition: 'all 0.2s' }}>
                                                            {answered !== null && isCorrect ? '✓' : ['A', 'B', 'C', 'D'][i]}
                                                        </span>
                                                        {opt}
                                                    </motion.button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div style={{ textAlign: 'center', padding: '40px 20px' }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                                    <motion.div style={{ fontSize: 72, marginBottom: 16 }}
                                        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6, delay: 0.3 }}>
                                        {correct === QUIZ_Q.length ? '🏆' : correct >= 2 ? '⭐' : '💪'}
                                    </motion.div>
                                    <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>
                                        {correct === QUIZ_Q.length ? 'Perfect Score!' : correct >= 2 ? 'Great job!' : 'Keep going!'}
                                    </h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{correct}/{QUIZ_Q.length} correct answers</p>
                                    <motion.div style={{ fontSize: 24, fontWeight: 900, color: '#f6ad55', marginBottom: 28 }}
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}>
                                        +{correct * 75} XP Earned! ⚡
                                    </motion.div>
                                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                        <button className="btn-secondary" onClick={resetQuiz}>Back to Map</button>
                                        <button className="btn-primary" onClick={startQuiz}>Try Again</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
