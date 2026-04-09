import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Shield, Trash2, Globe, HelpCircle, X, CheckCircle, Loader2, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/apiClient';

const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [notifs, setNotifs] = useState({ weather: true, growth: true, market: false });
    const [showLangModal, setShowLangModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    
    // Password state
    const [pwdState, setPwdState] = useState({ old: '', new: '', confirm: '' });
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);
    const [pwdSuccess, setPwdSuccess] = useState(false);

    const languages = [
        { name: 'English', code: 'en', native: 'English' },
        { name: 'Hindi', code: 'hi', native: 'हिन्दी' },
        { name: 'Telugu', code: 'te', native: 'తెలుగు' }
    ] as const;

    const handleLanguageSelect = (code: 'en' | 'hi' | 'te') => {
        setLanguage(code);
        setShowLangModal(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdError(null);
        setPwdSuccess(false);

        if (pwdState.new !== pwdState.confirm) {
            setPwdError('New passwords do not match');
            return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        setPwdLoading(true);
        try {
            await apiClient.post('Auth/change-password', {
                userId: Number(user.id),
                oldPassword: pwdState.old,
                newPassword: pwdState.new
            });
            setPwdSuccess(true);
            setPwdState({ old: '', new: '', confirm: '' });
            setTimeout(() => setShowPasswordModal(false), 2000);
        } catch (err: any) {
            console.error('Password change failed:', err);
            const msg = err.response?.data?.message || err.response?.data || 'Failed to change password';
            setPwdError(typeof msg === 'string' ? msg : 'Failed to change password');
        } finally {
            setPwdLoading(false);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handlePermanentDelete = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        setDeleteLoading(true);
        try {
            await apiClient.delete(`Auth/delete-account/${user.id}`);
            localStorage.clear();
            window.location.href = '/'; // Hard redirect to reset all state
        } catch (err) {
            console.error('Failed to delete account', err);
            alert('Failed to delete account. Please contact support.');
            setDeleteLoading(false);
        }
    };

    const currentLangName = languages.find(l => l.code === language)?.name || 'English';

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>{t('settings.title')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('settings.subtitle')}</p>
            </header>

            <div style={{ maxWidth: '800px' }}>
                {/* Notifications Section */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Bell size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem' }}>{t('settings.notifications')}</h2>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <SettingToggle 
                            label={t('settings.weather_alerts')} 
                            sub="Severe weather warnings and watering advice." 
                            active={notifs.weather} 
                            onToggle={() => setNotifs({...notifs, weather: !notifs.weather})} 
                        />
                        <SettingToggle 
                            label={t('settings.growth_milestones')} 
                            sub="Get notified when it's time to harvest or fertilize." 
                            active={notifs.growth} 
                            onToggle={() => setNotifs({...notifs, growth: !notifs.growth})} 
                        />
                        <SettingToggle 
                            label={t('settings.market_updates')} 
                            sub="Direct alerts for crop market price changes." 
                            active={notifs.market} 
                            onToggle={() => setNotifs({...notifs, market: !notifs.market})} 
                        />
                    </div>
                </section>

                {/* Account Section */}
                <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Shield size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem' }}>{t('settings.security.title')}</h2>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <SettingItem 
                            icon={<Lock size={20} />} 
                            title={t('settings.change_pwd')} 
                            onClick={() => setShowPasswordModal(true)} 
                        />
                        <SettingItem 
                            icon={<Globe size={20} />} 
                            title={t('settings.lang_settings')} 
                            right={currentLangName} 
                            onClick={() => setShowLangModal(true)}
                        />
                        <SettingItem 
                            icon={<HelpCircle size={20} />} 
                            title={t('settings.help')} 
                            onClick={() => setShowHelpModal(true)} 
                        />
                    </div>
                </section>

                {/* advanced Section */}
                <section>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #ffcdd2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#c62828' }}>
                            <Trash2 size={24} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800 }}>{t('settings.security.danger')}</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Permanently delete your account and all garden data.</div>
                            </div>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                style={{ background: '#c62828', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 600 }}
                            >
                                {t('settings.delete_acc')}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '3rem', borderRadius: '40px', position: 'relative', border: '1px solid #ffcdd2' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ background: '#ffebee', width: '64px', height: '64px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#c62828', marginBottom: '1.5rem' }}>
                                <Trash2 size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#c62828' }}>Are you sure?</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                This action is <strong>permanent</strong>. Your garden profile, plants, and history will be deleted from our database forever.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button 
                                onClick={handlePermanentDelete} 
                                disabled={deleteLoading}
                                style={{ 
                                    width: '100%', 
                                    padding: '14px', 
                                    borderRadius: '16px', 
                                    background: '#c62828', 
                                    color: 'white', 
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {deleteLoading ? <Loader2 className="animate-spin" /> : 'Yes, Delete Permanently'}
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#eee', color: 'var(--text-main)', fontWeight: 600 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Selection Modal */}
            {showLangModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '3rem', borderRadius: '40px', position: 'relative' }}>
                        <button 
                            onClick={() => setShowLangModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>{t('settings.lang_settings')}</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {languages.map((lang) => (
                                <div 
                                    key={lang.code}
                                    onClick={() => handleLanguageSelect(lang.code)}
                                    style={{ 
                                        padding: '1.5rem', 
                                        borderRadius: '20px', 
                                        background: language === lang.code ? 'rgba(33, 150, 243, 0.1)' : 'white',
                                        border: language === lang.code ? '2px solid var(--primary)' : '1px solid #eee',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 800, color: language === lang.code ? 'var(--primary)' : 'var(--text-main)' }}>{lang.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lang.native}</div>
                                    </div>
                                    {language === lang.code && <CheckCircle size={24} color="var(--primary)" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '40px', position: 'relative' }}>
                        <button 
                            onClick={() => setShowPasswordModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>{t('settings.modals.change_pwd_title')}</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Ensure your account stays secure.</p>

                        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', paddingLeft: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('settings.modals.current_pwd')}</label>
                                <input 
                                    type="password" 
                                    required
                                    value={pwdState.old}
                                    onChange={(e) => setPwdState({...pwdState, old: e.target.value})}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #eee', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', paddingLeft: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('settings.modals.new_pwd')}</label>
                                <input 
                                    type="password" 
                                    required
                                    value={pwdState.new}
                                    onChange={(e) => setPwdState({...pwdState, new: e.target.value})}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #eee', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', paddingLeft: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('settings.modals.confirm_pwd')}</label>
                                <input 
                                    type="password" 
                                    required
                                    value={pwdState.confirm}
                                    onChange={(e) => setPwdState({...pwdState, confirm: e.target.value})}
                                    style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #eee', outline: 'none' }}
                                />
                            </div>

                            {pwdError && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '12px', fontSize: '0.9rem' }}>{pwdError}</div>}
                            {pwdSuccess && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={18} /> Password updated successfully!
                            </div>}

                            <button type="submit" disabled={pwdLoading} className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {pwdLoading ? <Loader2 className="animate-spin" size={20} /> : t('common.save')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Help & Support Modal */}
            {showHelpModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', padding: '3.5rem', borderRadius: '40px', position: 'relative' }}>
                        <button 
                            onClick={() => setShowHelpModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{ background: 'rgba(33, 150, 243, 0.1)', width: '64px', height: '64px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                <HelpCircle size={32} />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('settings.modals.help_title')}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{t('settings.modals.help_subtitle')}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'white' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>{t('settings.modals.faq_1_q')}</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', opacity: 0.8 }}>{t('settings.modals.faq_1_a')}</p>
                            </div>
                            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'white' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>{t('settings.modals.faq_2_q')}</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', opacity: 0.8 }}>{t('settings.modals.faq_2_a')}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Still need help?</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Our team is here to support you.</div>
                            </div>
                            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} /> {t('settings.modals.contact_support')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

const SettingToggle = ({ label, sub, active, onToggle }: { label: string, sub: string, active: boolean, onToggle: () => void }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '90%' }}>{sub}</div>
        </div>
        <div 
            onClick={onToggle}
            style={{ 
                width: '50px', 
                height: '26px', 
                borderRadius: '13px', 
                background: active ? 'var(--primary)' : '#ddd',
                padding: '3px',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
                flexShrink: 0
            }}
        >
            <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: 'white',
                transform: `translateX(${active ? '24px' : '0'})`,
                transition: 'transform 0.3s ease'
            }}></div>
        </div>
    </div>
);

const SettingItem = ({ icon, title, right, onClick }: { icon: any, title: string, right?: string, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1.25rem', 
            borderRadius: '20px', 
            cursor: 'pointer',
            background: 'white',
            border: '1.5px solid #eee',
            transition: 'all 0.2s ease'
        }}
    >
        <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
        <div style={{ fontWeight: 700, flex: 1 }}>{title}</div>
        {right && <div style={{ color: 'var(--primary)', fontWeight: 800 }}>{right}</div>}
        <ExternalLink size={16} color="#ccc" />
    </div>
);

export default Settings;
