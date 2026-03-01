import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, BookOpen, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import './Login.css'

export default function Login() {
    const { t } = useTranslation()
    const { login } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const defaultRole = location.state?.role || 'student'
    const [role, setRole] = useState(defaultRole)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        const result = login(email, password)
        setLoading(false)
        if (result.success) {
            navigate(result.role === 'admin' ? '/admin' : '/student', { replace: true })
        } else {
            setError(result.error)
        }
    }

    const fillDemo = () => {
        if (role === 'admin') { setEmail('admin@vidyavaani.com'); setPassword('admin123') }
        else { setEmail('student@vidyavaani.com'); setPassword('student123') }
    }

    return (
        <div className="login-page">
            {/* BG Blobs */}
            <div className="login-blob b1" /><div className="login-blob b2" />

            <motion.div className="login-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-icon"><GraduationCap size={22} /></div>
                    <span style={{ fontWeight: 800, fontSize: 20 }}>Vidya <span style={{ color: 'var(--accent-primary)' }}>Vaani</span></span>
                </div>

                <div className="login-header">
                    <div className="hero-badge" style={{ justifyContent: 'center' }}>
                        <Sparkles size={13} /> <span>{t('login_welcome')}</span>
                    </div>
                    <p className="login-sub">{t('login_subtitle')}</p>
                </div>

                {/* Role Selector */}
                <div className="role-selector">
                    <motion.button
                        className={`role-card ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setEmail(''); setPassword(''); setError('') }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="role-icon admin"><BookOpen size={28} /></div>
                        <div className="role-label">{t('login_admin')}</div>
                    </motion.button>
                    <motion.button
                        className={`role-card ${role === 'student' ? 'active' : ''}`}
                        onClick={() => { setRole('student'); setEmail(''); setPassword(''); setError('') }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="role-icon student"><GraduationCap size={28} /></div>
                        <div className="role-label">{t('login_student')}</div>
                    </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="form-label">{t('login_email')}</label>
                        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            placeholder={role === 'admin' ? 'admin@vidyavaani.com' : 'student@vidyavaani.com'} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('login_password')}</label>
                        <div className="pass-wrapper">
                            <input className="form-input" type={showPass ? 'text' : 'password'}
                                value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                            <button type="button" className="pass-toggle" onClick={() => setShowPass(v => !v)}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div className="login-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <AlertCircle size={15} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" className={`btn-primary login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                        {loading ? <span className="spinner" /> : <><span>{t('login_signin')}</span><ArrowRight size={18} /></>}
                    </button>
                </form>

                {/* Demo hint */}
                <div className="demo-hint">
                    <span>Demo? </span>
                    <button type="button" onClick={fillDemo} className="demo-btn">Sign Up</button>
                </div>
            </motion.div>
        </div>
    )
}
