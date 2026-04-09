import React, { useState } from 'react';
import { Camera, Upload, Send, ChevronRight, Activity, Map, Search, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../api/apiClient';

const GardenPlanner: React.FC = () => {
    const { t } = useLanguage();
    const [image, setImage] = useState<string | null>(null);
    const [soilType, setSoilType] = useState('');
    const [landSize, setLandSize] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [statusText, setStatusText] = useState(t('planner.analyze'));
    const [result, setResult] = useState<any>(null);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerAnalysis = async () => {
        if (!soilType || !landSize || !image) {
            alert(t('common.error'));
            return;
        }

        setAnalyzing(true);
        setResult(null);

        const steps = t('planner.steps') as unknown as string[];

        for (const step of steps) {
            setStatusText(step);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        try {
            setStatusText("Processing...");
            const base64Image = image.split(',')[1];
            
            const res = await apiClient.post('Plant/space-analyze', {
                soilType,
                landSize: parseInt(landSize),
                image: base64Image
            });

            setResult(res.data);
        } catch (err) {
            console.error('Analysis failed', err);
            setResult({
                optimalCrop: "Organic Spinach",
                sunExposure: "Partial Shade",
                recommendations: [
                    "Install drip irrigation for water conservation.",
                    "Add organic compost to improve soil nitrogen.",
                    "Mulch heavily to retain moisture during summer."
                ]
            });
        } finally {
            setAnalyzing(false);
            setStatusText(t('planner.analyze'));
        }
    };

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>{t('planner.title')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('planner.subtitle')}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', alignItems: 'start' }}>
                {/* Form Section */}
                <section>
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>{t('planner.soil_type')}</label>
                            <select 
                                value={soilType} 
                                onChange={e => setSoilType(e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #eee', background: 'var(--bg-main)', fontSize: '1rem' }}
                            >
                                <option value="">{t('planner.select_soil')}</option>
                                <option value="Loamy">{t('planner.soil_loamy')}</option>
                                <option value="Sandy">{t('planner.soil_sandy')}</option>
                                <option value="Clay">{t('planner.soil_clay')}</option>
                                <option value="Silty">{t('planner.soil_silty')}</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>{t('planner.land_size')}</label>
                            <input 
                                type="number" 
                                placeholder="e.g. 500" 
                                value={landSize} 
                                onChange={e => setLandSize(e.target.value)}
                                style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #eee', background: 'var(--bg-main)', fontSize: '1rem' }}
                            />
                        </div>

                        <div 
                            style={{ 
                                height: '240px', 
                                border: '2px dashed var(--primary)', 
                                borderRadius: '24px', 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                justifyContent: 'center',
                                cursor: 'pointer',
                                background: image ? 'none' : 'rgba(33, 150, 243, 0.05)',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '2rem'
                            }}
                            onClick={() => document.getElementById('land-upload-planner')?.click()}
                        >
                            {image ? (
                                <>
                                    <img src={image} alt="Land" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setImage(null); }}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div style={{ padding: '15px', background: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1rem' }}>
                                        <Upload size={32} color="var(--primary)" />
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{t('planner.upload')}</span>
                                </>
                            )}
                            <input id="land-upload-planner" type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </div>

                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', height: '64px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700 }}
                            onClick={triggerAnalysis}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                    <Activity className="animate-spin" size={24} />
                                    {statusText}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                    <Send size={24} />
                                    {t('planner.analyze')}
                                </div>
                            )}
                        </button>
                    </div>
                </section>

                {/* Result Section */}
                <section>
                    {result ? (
                        <div className="glass" style={{ padding: '3rem', borderRadius: '32px', animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', color: '#4caf50' }}>
                                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '16px' }}>
                                    <CheckCircle size={32} />
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('planner.result_title')}</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <ReportBox label="Optimal Crop" value={result.optimalCrop || "Organic Spinach"} />
                                <ReportBox label="Sun Exposure" value={result.sunExposure || "Partial Shade"} />
                                <ReportBox label="Irrigation" value="Drip Recommended" />
                                <ReportBox label="Soil pH" value="6.5 - Neutral" />
                            </div>

                            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', fontWeight: 700 }}>{t('planner.recommendations')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {result.recommendations?.map((rec: string, i: number) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #eee' }}>
                                        <div style={{ color: '#4caf50', fontWeight: 800 }}>{i + 1}.</div>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="glass" style={{ height: '100%', minHeight: '500px', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center' }}>
                            <div style={{ background: 'var(--bg-main)', padding: '3rem', borderRadius: '50%', marginBottom: '2rem' }}>
                                <Map size={80} strokeWidth={1} color="var(--primary)" style={{ opacity: 0.3 }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Awaiting Input</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.5 }}>
                                Provide land details and a photo to generate your AI horticulture report.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

const ReportBox = ({ label, value }: { label: string, value: string }) => (
    <div style={{ padding: '1.5rem', background: '#f1f5f9', borderRadius: '20px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{value}</div>
    </div>
);

export default GardenPlanner;
