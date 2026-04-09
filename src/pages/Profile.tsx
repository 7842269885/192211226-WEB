import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Grid, Heart, Leaf, Edit2, Check, X, Shield, Settings, Trash2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/apiClient';

const Profile: React.FC = () => {
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const [editData, setEditData] = useState({
        name: '',
        email: '',
        phone: '',
        userType: '',
        location: '',
        gardenSize: '',
        primaryInterest: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchProfile(parsedUser.id);
        }
    }, []);

    const fetchProfile = async (userId: number) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`Profile/${userId}`);
            const data = response.data;
            setProfile(data);
            setEditData({
                name: data.name || user?.name || '',
                email: data.email || user?.email || '',
                phone: data.phone || '',
                userType: data.userType || '',
                location: data.location || '',
                gardenSize: data.gardenSize || '',
                primaryInterest: data.primaryInterest || ''
            });
        } catch (err) {
            console.error('Error fetching profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...profile,
                ...editData,
                userId: user.id
            };
            
            await apiClient.put(`Profile/${user.id}`, payload);
            
            // Update local state and localStorage
            const updatedProfile = { ...profile, ...editData };
            setProfile(updatedProfile);
            
            const updatedUser = { 
                ...user, 
                name: editData.name, 
                email: editData.email 
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setIsEditing(false);
            alert(t('common.success'));
        } catch (err) {
            console.error('Error saving profile', err);
            alert(t('common.error'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ marginLeft: '280px', padding: '3rem' }}>{t('common.loading')}</div>;

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>{t('profile.title')}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('profile.subtitle')}</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Edit2 size={20} />
                        {t('common.edit')}
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            {t('common.cancel')}
                        </button>
                        <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {saving ? t('common.loading') : t('common.save')}
                            <Check size={20} />
                        </button>
                    </div>
                )}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '3rem' }}>
                {/* Profile Card */}
                <section>
                    <div className="glass" style={{ padding: '3rem', borderRadius: '32px', textAlign: 'center', marginBottom: '2rem', border: isEditing ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.3)' }}>
                        <div style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '50%', 
                            background: 'var(--primary)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white',
                            fontSize: '3rem',
                            fontWeight: 800,
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 10px 30px rgba(33, 150, 243, 0.2)'
                        }}>
                            {(editData.name || user?.name || 'G')[0].toUpperCase()}
                        </div>
                        
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <input 
                                    type="text" 
                                    value={editData.name} 
                                    onChange={e => setEditData({...editData, name: e.target.value})}
                                    placeholder="Full Name"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 700 }}
                                />
                                <input 
                                    type="email" 
                                    value={editData.email} 
                                    onChange={e => setEditData({...editData, email: e.target.value})}
                                    placeholder="Email Address"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center' }}
                                />
                                <input 
                                    type="tel" 
                                    value={editData.phone} 
                                    onChange={e => setEditData({...editData, phone: e.target.value})}
                                    placeholder="Phone Number"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center' }}
                                />
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{profile?.name || user?.name || 'Gardener'}</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>{profile?.email || user?.email || 'email@example.com'}</p>
                            </>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                            <InfoItem icon={<Phone size={18} />} label="Phone" value={profile?.phone || 'Not provided'} />
                            <InfoItem icon={<Calendar size={18} />} label="Joined" value="March 2026" />
                            <InfoItem icon={<Shield size={18} />} label="Role" value="Pro Gardener" />
                        </div>
                    </div>
                </section>

                {/* Account Details & Stats */}
                <section>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                        <StatBox label={t('profile.persona')} value={profile?.userType || 'Determining...'} icon={<User color="var(--primary)" />} isEditing={isEditing} editValue={editData.userType} onEdit={v => setEditData({...editData, userType: v})} />
                        <StatBox label={t('profile.location')} value={profile?.location || 'Searching...'} icon={<MapPin color="#f44336" />} isEditing={isEditing} editValue={editData.location} onEdit={v => setEditData({...editData, location: v})} />
                        <StatBox label={t('profile.size')} value={profile?.gardenSize || 'Measuring...'} icon={<Grid color="#9c27b0" />} isEditing={isEditing} editValue={editData.gardenSize} onEdit={v => setEditData({...editData, gardenSize: v})} />
                        <StatBox label={t('profile.interest')} value={profile?.primaryInterest || 'Exploring...'} icon={<Leaf color="#4caf50" />} isEditing={isEditing} editValue={editData.primaryInterest} onEdit={v => setEditData({...editData, primaryInterest: v})} />
                    </div>

                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('dashboard.insights')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                        <InsightCard label={t('profile.health_score')} value="94%" color="#4caf50" />
                        <InsightCard label={t('profile.species_count')} value="8" color="var(--primary)" />
                        <InsightCard label={t('profile.completed_tasks')} value="24" color="#ff9800" />
                    </div>

                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('profile.account_mgmt')}</h2>
                    <div className="glass" style={{ padding: '0.5rem', borderRadius: '24px' }}>
                        <MenuItem icon={<Settings size={20} />} title={t('profile.notif_pref')} onClick={() => navigate('/settings')} />
                        <MenuItem icon={<Shield size={20} />} title={t('profile.privacy')} onClick={() => navigate('/privacy')} />
                        <MenuItem icon={<Trash2 size={20} />} title={t('profile.danger')} color="#D32F2F" onClick={() => navigate('/settings')} />
                    </div>
                </section>
            </div>
        </main>
    );
};

const InfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ color: 'var(--primary)', width: '24px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{value}</div>
        </div>
    </div>
);

const StatBox = ({ label, value, icon, isEditing, editValue, onEdit }: { label: string, value: string, icon: any, isEditing: boolean, editValue: string, onEdit: (v: string) => void }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem', border: isEditing ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.3)' }}>
        <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '12px' }}>{icon}</div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
            {isEditing ? (
                <input 
                    type="text" 
                    value={editValue} 
                    onChange={e => onEdit(e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ddd', width: '100%', fontSize: '1.1rem', fontWeight: 800, padding: '2px 0' }}
                />
            ) : (
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{value}</div>
            )}
        </div>
    </div>
);

const InsightCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: color, marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
    </div>
);

const MenuItem = ({ icon, title, color = 'var(--text-main)', onClick }: { icon: any, title: string, color?: string, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '1.25rem 1.5rem', 
            borderRadius: '16px', 
            cursor: 'pointer',
            color: color,
            fontWeight: 600,
            transition: 'all 0.2s ease'
        }} className="hover-item">
        <div style={{ opacity: 0.8 }}>{icon}</div>
        {title}
    </div>
);

export default Profile;
