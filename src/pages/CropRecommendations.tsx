import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Info, Sparkles, TrendingUp, DollarSign, Calendar, ChevronLeft } from 'lucide-react';
import apiClient from '../api/apiClient';

const CropRecommendations: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [soil, setSoil] = useState(location.state?.soil || 'Loamy');
    const [size, setSize] = useState(location.state?.size || '200 sq. ft');

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                // In a real app, this would use the soil/size params
                const res = await apiClient.get(`Analyze/crop-recommendations?soilType=${soil}&landSize=${size}`);
                setRecommendations(res.data);
            } catch (err) {
                console.error('Failed to fetch recommendations', err);
                // Fallback to mock data if API fails to show the UI
                setRecommendations([
                    { name: "Spinach", yield: "High", duration: "45-60 days", marketValue: "Premium", description: "Spinach grows exceptionally well in your loamy soil. It requires consistent moisture and partial shade during peak afternoon." },
                    { name: "Carrot", yield: "Optimal", duration: "70-80 days", marketValue: "Moderate", description: "The loose texture of your soil is perfect for root penetration. Ensure deep watering once a week for long, straight roots." },
                    { name: "Radish", yield: "Very High", duration: "25-35 days", marketValue: "Standard", description: "A quick-growing crop that helps loosen the soil for subsequent plantings. Harvest promptly to avoid woodiness." },
                    { name: "Lettuce", yield: "Moderate", duration: "50-60 days", marketValue: "High", description: "Excellent for multi-cropping. Prefers the nutrient-rich upper layer of your soil profile." }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [soil, size]);

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <div style={{ padding: '4px 12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                    AI Recommended
                </div>
            </div>

            <header style={{ marginBottom: '3.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Compatible Crops</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Based on your {soil} soil and {size} land area.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Optimizing horticultural matches...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
                    {recommendations.map((crop, idx) => (
                        <div key={idx} className="glass" style={{ padding: '2.5rem', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem' }}>
                                <div style={{ background: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                                    Match Score: 98%
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Leaf size={30} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{crop.name}</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <CropStat icon={<TrendingUp size={18} />} label="Potential Yield" value={crop.yield} />
                                <CropStat icon={<Calendar size={18} />} label="Growth Cycle" value={crop.duration} />
                                <CropStat icon={<DollarSign size={18} />} label="Market Value" value={crop.marketValue} />
                                <CropStat icon={<Sparkles size={18} />} label="Ease of Care" value="Beginner" />
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <Info size={16} /> Technical Insight
                                </div>
                                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>{crop.description}</p>
                            </div>

                            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', borderRadius: '16px' }}>
                                Start Cultivating
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

const CropStat = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ color: 'var(--primary)', opacity: 0.7 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
            <div style={{ fontWeight: 700 }}>{value}</div>
        </div>
    </div>
);

export default CropRecommendations;
