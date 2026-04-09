import React, { useState } from 'react';
import { BookOpen, Sprout, Droplets, FlaskConical, Bug, TrendingUp, Scissors, ChevronRight, X } from 'lucide-react';

const CultivationGuide: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<any>(null);

    const topics = [
        { 
            id: 'soil', 
            title: 'Soil Preparation', 
            icon: <Sprout size={28} />, 
            color: '#4caf50',
            content: "Good soil is the foundation of a healthy garden. For terrace gardens, use a mix of 30% Cocopeat, 30% Compost, and 40% Garden Soil. Ensure it is well-draining and rich in organic matter."
        },
        { 
            id: 'sowing', 
            title: 'Sowing Method', 
            icon: <BookOpen size={28} />, 
            color: '#2196f3',
            content: "A general rule: sow seeds at a depth twice their size. Small seeds can be scattered on top and covered lightly. Keep the soil moist until germination occurs."
        },
        { 
            id: 'irrigation', 
            title: 'Irrigation Planning', 
            icon: <Droplets size={28} />, 
            color: '#03a9f4',
            content: "Water your plants early in the morning or late in the evening to minimize evaporation. Avoid watering the leaves directly to prevent fungal diseases. Consistency is key!"
        },
        { 
            id: 'fertilizer', 
            title: 'Fertilizer Management', 
            icon: <FlaskConical size={28} />, 
            color: '#8e24aa',
            content: "Organic fertilizers like Vermicompost or Neem Cake are best for home gardens. Apply every 15-20 days during the growing season for optimal results."
        },
        { 
            id: 'pest', 
            title: 'Pest & Disease Prevention', 
            icon: <Bug size={28} />, 
            color: '#f44336',
            content: "Prevention is better than cure. Use Neem Oil spray weekly as a preventive measure. If you see pests like Aphids, wash them off with a gentle spray of water or soapy water."
        },
        { 
            id: 'timeline', 
            title: 'Growth Timeline', 
            icon: <TrendingUp size={28} />, 
            color: '#ff9800',
            content: "Plants go through Germination, Vegetative growth, Flowering, and Fruiting. Understanding these stages helps you provide the right care at the right time."
        },
        { 
            id: 'harvesting', 
            title: 'Harvesting Guide', 
            icon: <Scissors size={28} />, 
            color: '#795548',
            content: "Harvest in the morning when the temperature is cool. Use sharp tools to avoid damaging the plant. Pick vegetables like Okra or Chillies frequently to encourage more growth."
        }
    ];

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Cultivation Guide</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Master the art of botanical success with expert-led agricultural principles.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {topics.map((topic) => (
                    <div 
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className="glass card-hover" 
                        style={{ 
                            padding: '2rem', 
                            borderRadius: '32px', 
                            cursor: 'pointer',
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            textAlign: 'center',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '24px', 
                            background: `${topic.color}11`, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: topic.color,
                            marginBottom: '1.5rem',
                            boxShadow: `0 8px 16px ${topic.color}11`
                        }}>
                            {topic.icon}
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{topic.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Learn the essentials of {topic.title.toLowerCase()} for your home garden.
                        </p>
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: topic.color }}>
                            Read More <ChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Topic Detail Modal */}
            {selectedTopic && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3.5rem', borderRadius: '40px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}>
                        <button 
                            onClick={() => setSelectedTopic(null)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>
                        
                        <div style={{ 
                            width: '72px', 
                            height: '72px', 
                            borderRadius: '20px', 
                            background: `${selectedTopic.color}11`, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: selectedTopic.color,
                            marginBottom: '2rem'
                        }}>
                            {selectedTopic.icon}
                        </div>
                        
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{selectedTopic.title}</h2>
                        <div style={{ color: 'var(--text-main)', fontSize: '1.15rem', lineHeight: 1.8, background: '#f8fafc', padding: '2rem', borderRadius: '24px' }}>
                            {selectedTopic.content}
                        </div>
                        
                        <button 
                            onClick={() => setSelectedTopic(null)}
                            className="btn-primary" 
                            style={{ width: '100%', marginTop: '2.5rem', padding: '1.25rem', borderRadius: '16px', background: selectedTopic.color, boxShadow: `0 10px 20px ${selectedTopic.color}44` }}
                        >
                            Close Topic
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CultivationGuide;
