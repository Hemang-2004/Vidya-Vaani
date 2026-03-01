import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Upload, ClipboardList, ShieldAlert, Trophy, Pencil, LayoutDashboard, ChevronLeft, ChevronRight, LogOut, Sun, Moon, Menu, X, Map } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import './Layouts.css'

const NAV_ITEMS = [
    { path: '/admin', icon: LayoutDashboard, labelKey: 'a_dashboard', end: true },
    { path: '/admin/upload', icon: Upload, labelKey: 'a_upload' },
    { path: '/admin/assignments', icon: ClipboardList, labelKey: 'a_assignments' },
    { path: '/admin/plagiarism', icon: ShieldAlert, labelKey: 'a_plagiarism' },
    { path: '/admin/rankings', icon: Trophy, labelKey: 'a_rankings' },
    { path: '/admin/quiz', icon: Pencil, labelKey: 'a_quiz' },
    { path: '/admin/learner-map', icon: Map, labelKey: 'a_learner_map' },
]

export default function AdminLayout() {
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const doLogout = () => { logout(); navigate('/') }

    return (
        <div className="dashboard-layout">
            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && <motion.div className="sidebar-overlay" onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside className={`sidebar admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                animate={{ width: collapsed ? 72 : 260 }} transition={{ duration: 0.25 }}>

                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="logo-icon" style={{ flexShrink: 0 }}><GraduationCap size={20} /></div>
                    {!collapsed && <span className="sidebar-brand">Vidya <span className="logo-accent">Vaani</span></span>}
                </div>

                {/* User Badge */}
                {!collapsed && (
                    <div className="sidebar-user">
                        <div className="sidebar-avatar admin-avatar">{user?.avatar || '👩‍🏫'}</div>
                        <div>
                            <div className="sidebar-name">{user?.name}</div>
                            <div className="sidebar-role">Admin • {user?.subject || 'Teacher'}</div>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.end}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}>
                            <item.icon size={20} className="sidebar-link-icon" />
                            {!collapsed && <span>{t(item.labelKey)}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="sidebar-bottom">
                    <button className="sidebar-link" onClick={toggleTheme}>
                        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                        {!collapsed && <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    <button className="sidebar-link logout-btn" onClick={doLogout}>
                        <LogOut size={20} />
                        {!collapsed && <span>{t('logout')}</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button className="collapse-btn" onClick={() => setCollapsed(v => !v)}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </motion.aside>

            {/* Main */}
            <div className={`dashboard-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Topbar */}
                <div className="topbar">
                    <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)}>
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="topbar-right">
                        <div className="topbar-avatar admin-avatar">{user?.avatar || '👩‍🏫'}</div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
