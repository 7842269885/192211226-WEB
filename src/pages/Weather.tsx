import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets, ArrowLeft, Activity, Leaf, CloudSun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/apiClient';

const Weather: React.FC = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState<any>(null);
    const [hourly, setHourly] = useState<any[]>([]);
    const [impacts, setImpacts] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const [currentRes, hourlyRes, impactRes] = await Promise.all([
                    apiClient.get('Weather/current'),
                    apiClient.get('Weather/hourly'),
                    apiClient.get('Weather/impact')
                ]);
                setCurrent(currentRes.data || { temperature: 24, condition: 'Partly Cloudy', humidity: 64, windSpeed: 12.4, feelsLike: 26 });
                setHourly(hourlyRes.data || []);
                setImpacts(impactRes.data || []);
            } catch (err) {
                console.error('Failed to fetch weather data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWeatherData();
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (iconStr: string) => {
        const s = iconStr?.toLowerCase() || '';
        if (s.includes('sun') || s.includes('clear')) return <Sun size={100} strokeWidth={1.5} />;
        if (s.includes('rain') || s.includes('shower')) return <CloudRain size={100} strokeWidth={1.5} />;
        if (s.includes('partly')) return <CloudSun size={100} strokeWidth={1.5} />;
        return <Cloud size={100} strokeWidth={1.5} />;
    };

    if (loading) return (
        <div style={{ marginLeft: '280px', padding: '10rem 3rem', textAlign: 'center', background: 'var(--bg-main)', minHeight: '100vh' }}>
            <div className="animate-pulse" style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '50%', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cloud size={32} color="var(--primary)" />
            </div>
            <h3>{t('weather.loading')}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{t('weather.syncing')}</p>
        </div>
    );

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>{t('weather.title')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('weather.subtitle')}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Current Weather Card */}
                <section>
                    <div className="glass" style={{ padding: '3rem', borderRadius: '40px', background: 'linear-gradient(135deg, var(--primary) 0%, #1976d2 100%)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(25, 118, 210, 0.2)' }}>
                        <div style={{ position: 'absolute', right: '10px', top: '20px', opacity: 0.2 }}>
                            {getWeatherIcon(current?.condition)}
                        </div>
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, opacity: 0.9, marginBottom: '0.5rem' }}>{current?.location || 'Your Garden'} • Today</div>
                            <div style={{ fontSize: '6rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-2px' }}>{current?.temperature}°C</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '3rem' }}>{current?.condition}</div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                <WeatherMetric icon={<Droplets size={20} />} label={t('weather.humidity')} value={`${current?.humidity || 0}%`} />
                                <WeatherMetric icon={<Wind size={20} />} label={t('weather.wind')} value={`${current?.windSpeed || 0} km/h`} />
                                <WeatherMetric icon={<Thermometer size={20} />} label="Feels Like" value={`${current?.feelsLike || current?.temperature || 0}°C`} />
                            </div>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '3rem', marginBottom: '1.5rem' }}>{t('weather.impact')}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {impacts.length === 0 ? (
                            <div className="glass" style={{ padding: '2rem', borderRadius: '32px', textAlign: 'center' }}>
                                <Leaf size={48} color="#4caf50" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No significant weather impacts for your crops today.</p>
                            </div>
                        ) : impacts.map((impact: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '1.75rem', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                                <div style={{ background: 'rgba(33, 150, 243, 0.1)', padding: '16px', borderRadius: '20px' }}>
                                    <Leaf color="var(--primary)" size={28} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>{impact.title}</div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{impact.description}</p>
                                </div>
                                <div style={{ 
                                    padding: '6px 14px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 800,
                                    background: impact.riskLevel === 'High' ? '#ffebee' : impact.riskLevel === 'Medium' ? '#fff3e0' : '#e8f5e9',
                                    color: impact.riskLevel === 'High' ? '#c62828' : impact.riskLevel === 'Medium' ? '#ef6c00' : '#2e7d32'
                                }}>
                                    {impact.riskLevel}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hourly Forecast */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t('weather.forecast')}</h2>
                    <div className="glass" style={{ padding: '0.5rem', borderRadius: '32px' }}>
                        {hourly.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Hourly data unavailable.</div>
                        ) : hourly.map((hour: any, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: i === hourly.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ fontWeight: 700, width: '80px' }}>{hour.time}</div>
                                <div style={{ color: 'var(--primary)', flex: 1, textAlign: 'center' }}>
                                    <CloudSun size={20} style={{ margin: '0 auto' }} />
                                </div>
                                <div style={{ fontWeight: 800, width: '60px', textAlign: 'right' }}>{hour.temperature || hour.temp}°C</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

const WeatherMetric = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', opacity: 0.8 }}>
            {icon}
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
    </div>
);

export default Weather;
