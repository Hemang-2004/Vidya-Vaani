import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Trophy, TrendingUp, CheckCircle, X, Eye, Search } from 'lucide-react'

const STUDENTS = [
    { rank: 1, name: 'Arjun Mehta', rollNo: 'VV42', avatar: '🥇', attendance: 95, assignmentScore: 9.2, testScore: 91, lectureWatched: 18, lectureTotal: 18, trend: '+5' },
    { rank: 2, name: 'Priya Nair', rollNo: 'VV18', avatar: '🥈', attendance: 90, assignmentScore: 8.8, testScore: 87, lectureWatched: 17, lectureTotal: 18, trend: '+2' },
    { rank: 3, name: 'Vikram Rao', rollNo: 'VV07', avatar: '🥉', attendance: 88, assignmentScore: 8.5, testScore: 83, lectureWatched: 16, lectureTotal: 18, trend: '+1' },
    { rank: 4, name: 'Sneha Patel', rollNo: 'VV29', avatar: '👨‍🎓', attendance: 85, assignmentScore: 7.0, testScore: 78, lectureWatched: 14, lectureTotal: 18, trend: '-2' },
    { rank: 5, name: 'Rohan Das', rollNo: 'VV33', avatar: '👩‍🎓', attendance: 82, assignmentScore: 8.1, testScore: 75, lectureWatched: 15, lectureTotal: 18, trend: '+3' },
    { rank: 6, name: 'Aditya Verma', rollNo: 'VV11', avatar: '👨‍🎓', attendance: 70, assignmentScore: 6.0, testScore: 68, lectureWatched: 12, lectureTotal: 18, trend: '-4' },
    { rank: 7, name: 'Ananya Singh', rollNo: 'VV05', avatar: '👩‍🎓', attendance: 75, assignmentScore: 7.5, testScore: 72, lectureWatched: 13, lectureTotal: 18, trend: '0' },
]

export default function ClassRankings() {
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('rank')

    const sorted = [...STUDENTS]
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'rank') return a.rank - b.rank
            if (sort === 'attendance') return b.attendance - a.attendance
            if (sort === 'assignment') return b.assignmentScore - a.assignmentScore
            if (sort === 'test') return b.testScore - a.testScore
            return 0
        })

    const overallScore = (s) => Math.round((s.attendance * 0.3 + s.assignmentScore * 10 * 0.3 + s.testScore * 0.4))

    return (
        <div className="page-content">
            <div className="page-header">
                <h1 className="page-title">🏆 {t('a_rankings')}</h1>
                <p className="page-subtitle">Real-time class standings based on attendance, assignments, and test performance</p>
            </div>

            {/* Top 3 Podium */}
            <motion.div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 32, alignItems: 'flex-end', flexWrap: 'wrap' }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                {[STUDENTS[1], STUDENTS[0], STUDENTS[2]].map((s, i) => {
                    const heights = [160, 200, 140]
                    const colors = ['#c0c0c0', '#FFD700', '#CD7F32']
                    return (
                        <div key={s.rank} style={{ textAlign: 'center', width: 130 }}>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.avatar}</div>
                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.name.split(' ')[0]}</div>
                            <span className="badge badge-primary" style={{ marginBottom: 8, display: 'inline-block' }}>{overallScore(s)}</span>
                            <div style={{ height: heights[i], background: `${colors[i]}20`, border: `2px solid ${colors[i]}`, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: 32, fontWeight: 900, color: colors[i] }}>#{[2, 1, 3][i]}</div>
                            </div>
                        </div>
                    )
                })}
            </motion.div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36, width: '100%' }} placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-input" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="rank">Sort: Overall Rank</option>
                    <option value="attendance">Sort: Attendance</option>
                    <option value="assignment">Sort: Assignment Score</option>
                    <option value="test">Sort: Test Score</option>
                </select>
            </div>

            {/* Table */}
            <motion.div className="card" style={{ padding: 0, overflow: 'hidden' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Student</th>
                                <th>Attendance</th>
                                <th>Assignments</th>
                                <th>Test Score</th>
                                <th>Lectures Watched</th>
                                <th>Overall</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((s, i) => (
                                <motion.tr key={s.rollNo} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 18 }}>{s.rank <= 3 ? ['🥇', '🥈', '🥉'][s.rank - 1] : `#${s.rank}`}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ fontSize: 18 }}>{s.avatar}</div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{s.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.rollNo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 60 }}>
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: `${s.attendance}%` }} />
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: 13 }}>{s.attendance}%</span>
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: 700, color: s.assignmentScore >= 8 ? 'var(--accent-secondary)' : s.assignmentScore >= 6 ? '#f6ad55' : 'var(--accent-danger)' }}>{s.assignmentScore}/10</span></td>
                                    <td><span style={{ fontWeight: 700 }}>{s.testScore}%</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {s.lectureWatched < s.lectureTotal
                                                ? <><X size={13} style={{ color: 'var(--accent-danger)' }} /><span style={{ fontSize: 13, color: 'var(--accent-danger)' }}>{s.lectureWatched}/{s.lectureTotal}</span></>
                                                : <><CheckCircle size={13} style={{ color: 'var(--accent-secondary)' }} /><span style={{ fontSize: 13, color: 'var(--accent-secondary)' }}>All</span></>}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontWeight: 800, fontSize: 16,
                                            background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                        }}>
                                            {overallScore(s)}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, fontSize: 13, color: s.trend.startsWith('+') ? 'var(--accent-secondary)' : s.trend === '0' ? 'var(--text-muted)' : 'var(--accent-danger)' }}>
                                            {s.trend === '0' ? '→' : s.trend.startsWith('+') ? `↑${s.trend}` : `↓${s.trend.slice(1)}`}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
