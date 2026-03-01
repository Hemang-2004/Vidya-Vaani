import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Map, FileText, BarChart3, Lightbulb, LayoutDashboard, ChevronLeft, ChevronRight, LogOut, Sun, Moon, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import '../Admin/Layouts.css'

const NAV_ITEMS = [
    { path: '/student', icon: LayoutDashboard, labelKey: 's_dashboard', end: true },
    { path: '/student/learner-map', icon: Map, labelKey: 's_map' },
    { path: '/student/summary', icon: FileText, labelKey: 's_summary' },
    { path: '/student/marks', icon: BarChart3, labelKey: 's_marks' },
    { path: '/student/insights', icon: Lightbulb, labelKey: 's_insights' },
]

export default function StudentLayout() {
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const doLogout = () => { logout(); navigate('/') }

    return (
        <div className="dashboard-layout">
            <AnimatePresence>
                {mobileOpen && <motion.div className="sidebar-overlay" onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
            </AnimatePresence>

            <motion.aside className={`sidebar student-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                animate={{ width: collapsed ? 72 : 260 }} transition={{ duration: 0.25 }}>

                <div className="sidebar-logo">
                    <div className="logo-icon" style={{ flexShrink: 0, background: 'linear-gradient(135deg, #48bb78, #68d391)' }}><GraduationCap size={20} /></div>
                    {!collapsed && <span className="sidebar-brand">Vidya <span style={{ color: 'var(--accent-secondary)' }}>Vaani</span></span>}
                </div>

                {!collapsed && (
                    <div className="sidebar-user">
                        <div className="sidebar-avatar student-avatar">{user?.avatar || '👨‍🎓'}</div>
                        <div>
                            <div className="sidebar-name">{user?.name}</div>
                            <div className="sidebar-role">{user?.class || 'Student'} • {user?.rollNo}</div>
                        </div>
                    </div>
                )}

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.end}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                            style={({ isActive }) => isActive ? { color: 'var(--accent-secondary)', background: 'rgba(72,187,120,0.12)' } : {}}>
                            <item.icon size={20} className="sidebar-link-icon" />
                            {!collapsed && <span>{t(item.labelKey)}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button className="sidebar-link" onClick={toggleTheme}>
                        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                        {!collapsed && <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    <button className="sidebar-link logout-btn" onClick={doLogout}>
                        <LogOut size={20} />{!collapsed && <span>{t('logout')}</span>}
                    </button>
                </div>

                <button className="collapse-btn" onClick={() => setCollapsed(v => !v)}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </motion.aside>

            <div className={`dashboard-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <div className="topbar">
                    <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)}>
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="topbar-right">
                        <div className="topbar-avatar student-avatar">{user?.avatar || '👨‍🎓'}</div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
