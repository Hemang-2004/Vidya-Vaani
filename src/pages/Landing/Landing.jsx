import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, BookOpen, Sun, Moon, Volume2, Globe, ChevronDown, Sparkles, Brain, Shield, Map, BarChart3, Users, ArrowRight, Star, Zap, Award } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import './Landing.css'

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
]

const TIMELINE_ITEMS = [
    { icon: Brain, color: '#6c63ff', key: 'tl1', side: 'left' },
    { icon: BookOpen, color: '#48bb78', key: 'tl2', side: 'right' },
    { icon: Shield, color: '#fc8181', key: 'tl3', side: 'left' },
    { icon: Map, color: '#f6ad55', key: 'tl4', side: 'right' },
    { icon: BarChart3, color: '#63b3ed', key: 'tl5', side: 'left' },
    { icon: Users, color: '#9f8fff', key: 'tl6', side: 'right' },
]

const STATS = [
    { value: '12,000+', labelKey: 'stats_students', icon: GraduationCap, color: '#6c63ff' },
    { value: '800+', labelKey: 'stats_teachers', icon: Users, color: '#48bb78' },
    { value: '15,000+', labelKey: 'stats_lectures', icon: BookOpen, color: '#f6ad55' },
    { value: '50,000+', labelKey: 'stats_assignments', icon: Award, color: '#fc8181' },
]

export default function Landing() {
    const { t, i18n } = useTranslation()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [langOpen, setLangOpen] = useState(false)
    const [narrativeOn, setNarrativeOn] = useState(false)

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

    return (
        <div className="landing">
            {/* ===== NAVBAR ===== */}
            <nav className="landing-nav">
                <div className="nav-inner">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon"><GraduationCap size={22} /></div>
                        <span className="logo-text">Vidya <span className="logo-accent">Vaani</span></span>
                    </Link>

                    <div className="nav-actions">
                        {/* Narrative Toggle */}
                        <motion.button
                            className={`nav-btn ${narrativeOn ? 'active' : ''}`}
                            onClick={() => setNarrativeOn(v => !v)}
                            whileTap={{ scale: 0.9 }}
                            title={t('nav_narrative')}
                        >
                            <Volume2 size={18} />
                        </motion.button>

                        {/* Theme Toggle */}
                        <motion.button className="nav-btn" onClick={toggleTheme} whileTap={{ scale: 0.9 }}>
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </motion.button>

                        {/* Language Selector */}
                        <div className="lang-wrapper">
                            <motion.button className="lang-btn" onClick={() => setLangOpen(v => !v)} whileTap={{ scale: 0.95 }}>
                                <Globe size={16} />
                                <span>{currentLang.native}</span>
                                <motion.div animate={{ rotate: langOpen ? 180 : 0 }}>
                                    <ChevronDown size={14} />
                                </motion.div>
                            </motion.button>
                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        className="lang-dropdown"
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    >
                                        {LANGUAGES.map(l => (
                                            <button key={l.code} className={`lang-option ${i18n.language === l.code ? 'selected' : ''}`}
                                                onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false) }}>
                                                <span>{l.native}</span>
                                                <span className="lang-sub">{l.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Login CTA */}
                        <Link to="/login" className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
                            {t('nav_login')} <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="hero">
                {/* Animated BG Blobs */}
                <div className="hero-blob blob-1" />
                <div className="hero-blob blob-2" />
                <div className="hero-blob blob-3" />

                <div className="hero-content">
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    >
                        <Sparkles size={14} />
                        <span>AI-Powered Education Platform for India</span>
                        <Sparkles size={14} />
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    >
                        {t('hero_tagline')}
                    </motion.h1>

                    <motion.p
                        className="hero-sub"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    >
                        {t('hero_sub')}
                    </motion.p>

                    <motion.div
                        className="hero-cta"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    >
                        <button className="hero-btn-student" onClick={() => navigate('/login', { state: { role: 'student' } })}>
                            <GraduationCap size={20} />
                            {t('hero_student')}
                        </button>
                        <button className="hero-btn-teacher" onClick={() => navigate('/login', { state: { role: 'admin' } })}>
                            <BookOpen size={20} />
                            {t('hero_teacher')}
                        </button>
                    </motion.div>

                    {/* Floating Cards */}
                    <div className="hero-cards">
                        <motion.div className="hero-float-card left" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                            <Zap size={16} style={{ color: '#6c63ff' }} />
                            <div><div style={{ fontWeight: 700, fontSize: 13 }}>AI Powered</div><div style={{ fontSize: 11, opacity: 0.7 }}>Smart Summaries</div></div>
                        </motion.div>
                        <motion.div className="hero-float-card right" animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                            <Star size={16} style={{ color: '#f6ad55' }} />
                            <div><div style={{ fontWeight: 700, fontSize: 13 }}>Rank #1</div><div style={{ fontSize: 11, opacity: 0.7 }}>Learner Map XP</div></div>
                        </motion.div>
                    </div>
                </div>

                {/* Hero Illustration */}
                <motion.div
                    className="hero-illustration"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="hero-circle-outer">
                        <div className="hero-circle-inner">
                            <div className="hero-emoji">🎓</div>
                        </div>
                        <div className="orbit-dot dot-1"><Brain size={20} /></div>
                        <div className="orbit-dot dot-2"><BookOpen size={20} /></div>
                        <div className="orbit-dot dot-3"><Award size={20} /></div>
                        <div className="orbit-dot dot-4"><Zap size={20} /></div>
                    </div>
                </motion.div>
            </section>

            {/* ===== STATS BANNER ===== */}
            <section className="stats-banner">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i} className="stat-item"
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    >
                        <div className="stat-icon-wrap" style={{ background: `${stat.color}20` }}>
                            <stat.icon size={24} style={{ color: stat.color }} />
                        </div>
                        <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="stat-label">{t(stat.labelKey)}</div>
                    </motion.div>
                ))}
            </section>

            {/* ===== VERTICAL TIMELINE ===== */}
            <section className="timeline-section">
                <motion.div className="timeline-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="section-badge"><Sparkles size={14} /> Features</div>
                    <h2 className="section-title">{t('timeline_title')}</h2>
                    <p className="section-sub">{t('timeline_sub')}</p>
                </motion.div>

                <div className="timeline-track">
                    <div className="timeline-line" />
                    {TIMELINE_ITEMS.map((item, i) => (
                        <motion.div
                            key={i}
                            className={`timeline-item ${item.side}`}
                            initial={{ opacity: 0, x: item.side === 'left' ? -60 : 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="timeline-connector">
                                <div className="timeline-node" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}>
                                    <item.icon size={20} color="white" />
                                </div>
                            </div>
                            <motion.div className="timeline-card" whileHover={{ scale: 1.02, y: -4 }}>
                                <div className="timeline-card-icon" style={{ background: `${item.color}18`, color: item.color }}>
                                    <item.icon size={22} />
                                </div>
                                <h3 className="timeline-card-title">{t(`${item.key}_title`)}</h3>
                                <p className="timeline-card-desc">{t(`${item.key}_desc`)}</p>
                                <div className="timeline-card-num" style={{ color: item.color }}>0{i + 1}</div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="cta-section">
                <motion.div
                    className="cta-card"
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                >
                    <div className="cta-bg-blur" />
                    <div className="hero-badge" style={{ marginBottom: 20 }}>
                        <Sparkles size={14} /> <span>Get Started Today</span> <Sparkles size={14} />
                    </div>
                    <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
                        Ready to Transform <span className="text-gradient">Learning?</span>
                    </h2>
                    <p style={{ opacity: 0.75, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                        Join thousands of students and teachers already using Vidya Vaani to achieve extraordinary results.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="hero-btn-student" onClick={() => navigate('/login', { state: { role: 'student' } })}>
                            <GraduationCap size={20} /> {t('hero_student')}
                        </button>
                        <button className="hero-btn-teacher" onClick={() => navigate('/login', { state: { role: 'admin' } })}>
                            <BookOpen size={20} /> {t('hero_teacher')}
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="landing-footer">
                <div className="footer-inner">
                    <div className="nav-logo" style={{ marginBottom: 0 }}>
                        <div className="logo-icon"><GraduationCap size={18} /></div>
                        <span className="logo-text">Vidya <span className="logo-accent">Vaani</span></span>
                    </div>
                    <p style={{ opacity: 0.6, fontSize: 13 }}>{t('footer_tagline')}</p>
                    <p style={{ opacity: 0.5, fontSize: 12, marginTop: 8 }}>{t('footer_rights')}</p>
                </div>
            </footer>
        </div>
    )
}
