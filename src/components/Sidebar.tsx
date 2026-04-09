import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Cloud, User, Settings, Bell, LogOut, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const menuItems = [
        { title: t('sidebar.my_garden'), icon: <Leaf size={20} />, path: '/dashboard' },
        { title: t('sidebar.planner'), icon: <Camera size={20} />, path: '/planner' },
        { title: t('sidebar.guides'), icon: <Leaf size={20} />, path: '/guides/cultivation' },
        { title: t('sidebar.care'), icon: <Leaf size={20} />, path: '/guides/care' },
        { title: t('sidebar.weather'), icon: <Cloud size={20} />, path: '/weather' },
        { title: t('sidebar.notifications'), icon: <Bell size={20} />, path: '/notifications' },
        { title: t('sidebar.profile'), icon: <User size={20} />, path: '/profile' },
        { title: t('sidebar.settings'), icon: <Settings size={20} />, path: '/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="glass" style={{ 
            width: '280px', 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            borderRight: '1px solid rgba(0,0,0,0.05)', 
            position: 'fixed', 
            height: '100vh',
            zIndex: 100
        }}>
            <div 
                onClick={() => navigate('/dashboard')}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: 'var(--primary)', 
                    marginBottom: '3rem',
                    cursor: 'pointer'
                }}
            >
                <Leaf size={28} />
                <span>GrowSmart</span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <div 
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem', 
                            padding: '0.85rem 1rem', 
                            borderRadius: '12px', 
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: location.pathname === item.path ? 'var(--primary)' : 'transparent',
                            color: location.pathname === item.path ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {item.icon}
                        {item.title}
                    </div>
                ))}
            </nav>

            <button 
                onClick={handleLogout} 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    color: '#c62828', 
                    fontWeight: 600, 
                    background: 'transparent',
                    marginTop: 'auto',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s'
                }}
            >
                <LogOut size={20} />
                {t('common.logout')}
            </button>
        </aside>
    );
};

export default Sidebar;
