import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Grid, Heart, Bell, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import apiClient from '../api/apiClient';

const ProfileSetup: React.FC = () => {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        userType: 'Urban Gardener',
        location: '',
        gardenSize: 'Medium',
        cropInterests: [] as string[],
        notifWeather: true,
        notifCultivation: true,
        notifMarket: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleNext = () => {
        if (step < 6) setStep(step + 1);
        else handleFinish();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinish = async () => {
        try {
            await apiClient.post('Profile', {
                userId: user.id,
                ...formData,
                cropInterests: formData.cropInterests.join(',')
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Error saving profile', err);
            // Even if it fails, let them go to dashboard for now as a fallback
            navigate('/dashboard');
        }
    };

    const toggleCrop = (crop: string) => {
        setFormData(prev => ({
            ...prev,
            cropInterests: prev.cropInterests.includes(crop)
                ? prev.cropInterests.filter(c => c !== crop)
                : [...prev.cropInterests, crop]
        }));
    };

    const handleAutoLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                // Reverse geocoding using OpenStreetMap Nominatim (Free)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village || data.address.state || "Detected Locale";
                setFormData(prev => ({ ...prev, location: city }));
            } catch (err) {
                console.error("Reverse geocoding failed", err);
                setFormData(prev => ({ ...prev, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` }));
            }
        }, (err) => {
            alert('Unable to retrieve your location. Please type it manually.');
            console.error(err);
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            {/* Progress Header */}
            <div style={{ width: '100%', maxWidth: '800px', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(s => (
                        <div key={s} style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: s === step ? 'var(--primary)' : s < step ? 'var(--primary-dark)' : 'white',
                            color: s <= step ? 'white' : 'var(--text-muted)',
                            fontWeight: 700,
                            border: '2px solid' + (s === step ? 'var(--primary)' : s < step ? 'var(--primary-dark)' : '#ddd'),
                            transition: 'all 0.3s ease'
                        }}>
                            {s < step ? <Check size={20} /> : s}
                        </div>
                    ))}
                </div>
                <div style={{ height: '4px', background: '#ddd', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ 
                        position: 'absolute', 
                        height: '100%', 
                        background: 'var(--primary)', 
                        width: `${((step - 1) / 5) * 100}%`,
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Step Content */}
            <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                {step === 1 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Personal Information</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Let's get to know you better</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Input label="First Name" value={formData.firstName} onChange={v => setFormData({...formData, firstName: v})} />
                                <Input label="Last Name" value={formData.lastName} onChange={v => setFormData({...formData, lastName: v})} />
                            </div>
                            <Input label="Phone Number" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                            <Input label="Address" value={formData.address} onChange={v => setFormData({...formData, address: v})} multiline />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in text-center">
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Green Persona</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tell us which type of gardener you are</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <OptionCard 
                                active={formData.userType === 'Urban Gardener'} 
                                onClick={() => setFormData({...formData, userType: 'Urban Gardener'})}
                                title="Urban Gardener" 
                                desc="Growing in urban city spaces" 
                            />
                            <OptionCard 
                                active={formData.userType === 'Balcony/Terrace'} 
                                onClick={() => setFormData({...formData, userType: 'Balcony/Terrace'})}
                                title="Balcony/Terrace" 
                                desc="Pots and small containers" 
                            />
                            <OptionCard 
                                active={formData.userType === 'Backyard Grower'} 
                                onClick={() => setFormData({...formData, userType: 'Backyard Grower'})}
                                title="Backyard Grower" 
                                desc="Small soil plots at home" 
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in text-center">
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Set Your Locale</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Personalized advice based on your climate</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <button 
                                onClick={handleAutoLocation}
                                className="btn-secondary" 
                                style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', border: '2px dashed var(--primary)', color: 'var(--primary)', background: 'transparent', cursor: 'pointer' }}
                            >
                                <MapPin size={24} />
                                Auto-Detect Location
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                            </div>
                            <Input label="Search City or Region" value={formData.location} onChange={v => setFormData({...formData, location: v})} />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="fade-in text-center">
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Space Dimensions</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Approximate size of your growing area</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <OptionCard 
                                active={formData.gardenSize === 'Small'} 
                                onClick={() => setFormData({...formData, gardenSize: 'Small'})}
                                title="Small Space" 
                                desc="Less than 100 sq ft" 
                            />
                            <OptionCard 
                                active={formData.gardenSize === 'Medium'} 
                                onClick={() => setFormData({...formData, gardenSize: 'Medium'})}
                                title="Medium Space" 
                                desc="100 - 500 sq ft" 
                            />
                            <OptionCard 
                                active={formData.gardenSize === 'Large'} 
                                onClick={() => setFormData({...formData, gardenSize: 'Large'})}
                                title="Large Space" 
                                desc="More than 500 sq ft" 
                            />
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Garden Interests</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>What would you like to grow?</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Vegetables', 'Fruits', 'Herbs', 'Flowers'].map(crop => (
                                <div 
                                    key={crop}
                                    onClick={() => toggleCrop(crop)}
                                    style={{ 
                                        padding: '1.5rem', 
                                        borderRadius: '16px', 
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        border: '2px solid' + (formData.cropInterests.includes(crop) ? 'var(--primary)' : '#eee'),
                                        background: formData.cropInterests.includes(crop) ? 'var(--secondary)' : 'white',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: formData.cropInterests.includes(crop) ? 'var(--primary-dark)' : 'var(--text-main)' }}>{crop}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Stay Informed</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Choose what you want to be alerted about</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Toggle label="Weather Alerts" sub="Rain, storm, heat alerts" active={formData.notifWeather} onToggle={() => setFormData({...formData, notifWeather: !formData.notifWeather})} />
                            <Toggle label="Cultivation Tips" sub="Watering and fertilizing alerts" active={formData.notifCultivation} onToggle={() => setFormData({...formData, notifCultivation: !formData.notifCultivation})} />
                            <Toggle label="Market Prices" sub="Daily crop price updates" active={formData.notifMarket} onToggle={() => setFormData({...formData, notifMarket: !formData.notifMarket})} />
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                    <button 
                        onClick={handleBack} 
                        style={{ 
                            padding: '12px 24px', 
                            visibility: step === 1 ? 'hidden' : 'visible',
                            color: 'var(--text-muted)', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <button onClick={handleNext} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {step === 6 ? 'Get Started' : 'Continue'}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, value, onChange, multiline = false }: { label: string, value: string, onChange: (v: string) => void, multiline?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
        {multiline ? (
            <textarea 
                value={value} 
                onChange={e => onChange(e.target.value)} 
                rows={3}
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #eee', outline: 'none', focus: { borderColor: 'var(--primary)' } } as any}
            />
        ) : (
            <input 
                type="text" 
                value={value} 
                onChange={e => onChange(e.target.value)} 
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #eee', outline: 'none' }}
            />
        )}
    </div>
);

const OptionCard = ({ active, onClick, title, desc }: { active: boolean, onClick: () => void, title: string, desc: string }) => (
    <div 
        onClick={onClick}
        style={{ 
            padding: '1.25rem 1.5rem', 
            borderRadius: '16px', 
            cursor: 'pointer',
            border: '2px solid' + (active ? 'var(--primary)' : '#eee'),
            background: active ? 'var(--secondary)' : 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.2s ease'
        }}
    >
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {active && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
        </div>
        <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: active ? 'var(--primary-dark)' : 'var(--text-main)' }}>{title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{desc}</div>
        </div>
    </div>
);

const Toggle = ({ label, sub, active, onToggle }: { label: string, sub: string, active: boolean, onToggle: () => void }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sub}</div>
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
                transition: 'background 0.3s ease'
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

export default ProfileSetup;
