import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Droplets, Leaf, AlertTriangle, Plus, Trash2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/apiClient';

interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type?: string; 
}

const Notifications: React.FC = () => {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [newReminder, setNewReminder] = useState({ title: '', message: '', type: 'Reminder' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchNotifications(parsedUser.id);
        }
    }, []);

    const fetchNotifications = async (userId: number) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`Notifications/user/${userId}`);
            setNotifications(response.data || []);
        } catch (err) {
            console.error('Error fetching notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newReminder.title) return;

        setSaving(true);
        try {
            await apiClient.post('Notifications', {
                ...newReminder,
                userId: user.id,
                isRead: false,
                createdAt: new Date().toISOString()
            });
            setShowModal(false);
            setNewReminder({ title: '', message: '', type: 'Reminder' });
            fetchNotifications(user.id);
        } catch (err) {
            console.error('Error creating reminder', err);
        } finally {
            setSaving(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await apiClient.post(`Notifications/read/${id}`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`Notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting notification', err);
        }
    };

    const getIcon = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'watering': return <Droplets size={20} />;
            case 'weather': return <Cloud size={20} />;
            case 'task': return <Check size={20} />;
            case 'emergency': return <AlertTriangle size={20} />;
            default: return <Bell size={20} />;
        }
    };

    const getIconBg = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'watering': return '#e3f2fd';
            case 'weather': return '#fff3e0';
            case 'task': return '#e8f5e9';
            case 'emergency': return '#ffebee';
            default: return '#f3e5f5';
        }
    };

    const getIconColor = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'watering': return '#1976d2';
            case 'weather': return '#f57c00';
            case 'task': return '#2e7d32';
            case 'emergency': return '#d32f2f';
            default: return '#7b1fa2';
        }
    };

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>{t('notifications.title')}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('notifications.subtitle')}</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    {t('notifications.add_reminder')}
                </button>
            </header>

            <div className="glass" style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <div style={{ padding: '6rem 3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.loading')}</div>
                ) : notifications.length === 0 ? (
                    <div style={{ padding: '8rem 3rem', textAlign: 'center' }}>
                        <div style={{ background: 'var(--bg-main)', width: '100px', height: '100px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            <Bell size={48} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '1rem' }}>{t('notifications.no_notifs')}</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Check back later for automated care alerts and local climate warnings.</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((notif) => (
                            <div key={notif.id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1.5rem', 
                                padding: '1.75rem 3rem', 
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                background: notif.isRead ? 'transparent' : 'rgba(33, 150, 243, 0.03)',
                                transition: 'all 0.2s ease'
                            }}>
                                <div style={{ 
                                    padding: '12px', 
                                    borderRadius: '16px', 
                                    background: getIconBg(notif.type),
                                    color: getIconColor(notif.type)
                                }}>
                                    {getIcon(notif.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{notif.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Clock size={14} />
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{notif.message}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {!notif.isRead && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            style={{ padding: '10px', borderRadius: '12px', border: 'none', background: 'var(--primary-light)', color: 'var(--primary)', cursor: 'pointer', display: 'flex' }}
                                            title={t('notifications.mark_read')}
                                        >
                                            <Check size={18} strokeWidth={3} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(notif.id)}
                                        style={{ padding: '10px', borderRadius: '12px', border: 'none', background: '#fff1f1', color: '#ff4d4d', cursor: 'pointer', display: 'flex' }}
                                        title={t('notifications.delete')}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Reminder Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '32px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem', fontWeight: 800 }}>{t('notifications.add_reminder')}</h2>
                        <form onSubmit={handleCreateReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Title</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newReminder.title} 
                                    onChange={e => setNewReminder({...newReminder, title: e.target.value})}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', background: 'var(--bg-main)' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Description</label>
                                <textarea 
                                    required 
                                    rows={3}
                                    value={newReminder.message} 
                                    onChange={e => setNewReminder({...newReminder, message: e.target.value})}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', background: 'var(--bg-main)', resize: 'none' }} 
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={saving} style={{ height: '60px', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem' }}>
                                {saving ? t('common.loading') : 'Create Reminder'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

const Cloud = ({ size, color, strokeWidth = 2 }: any) => <Bell size={size} color={color} strokeWidth={strokeWidth} />;

export default Notifications;
