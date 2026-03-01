import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const MOCK_USERS = {
    'admin@vidyavaani.com': { password: 'admin123', role: 'admin', name: 'Prof. Priya Sharma', avatar: '👩‍🏫', subject: 'Mathematics' },
    'student@vidyavaani.com': { password: 'student123', role: 'student', name: 'Arjun Mehta', avatar: '👨‍🎓', class: '10th Grade', rollNo: 'VV2024-042' },
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('vv-user')) || null; }
        catch { return null; }
    });

    const login = (email, password) => {
        const found = MOCK_USERS[email.toLowerCase()];
        if (found && found.password === password) {
            const u = { email, ...found };
            setUser(u);
            localStorage.setItem('vv-user', JSON.stringify(u));
            return { success: true, role: found.role };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vv-user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', isStudent: user?.role === 'student' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
