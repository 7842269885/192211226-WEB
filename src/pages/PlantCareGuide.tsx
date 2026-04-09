import React, { useState } from 'react';
import { Search, Filter, Droplets, Sun, Thermometer, Wind, Leaf, X, ChevronRight } from 'lucide-react';

const PlantCareGuide: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPlant, setSelectedPlant] = useState<any>(null);

    const categories = ['All', 'Vegetables', 'Flowers', 'Herbs', 'Succulents'];

    const plantGuides = [
         { 
            name: "Tomato", 
            category: "Vegetables", 
            image: "🍅",
            light: "Full Sun (6-8 hours)",
            water: "Regularly, keep soil moist but not soggy",
            temp: "21°C - 29°C",
            care: "Provide support with stakes or cages. Remove suckers for better yield. Feed with phosphorus-rich fertilizer when flowering."
        },
        { 
            name: "Aloe Vera", 
            category: "Succulents", 
            image: "🪴",
            light: "Bright Indirect Light",
            water: "Let soil dry completely between waterings",
            temp: "13°C - 27°C",
            care: "Use well-draining cactus mix soil. Avoid getting water on the leaves to prevent rot. Repot when pups crowd the parent plant."
        },
        { 
            name: "Rose", 
            category: "Flowers", 
            image: "🌹",
            light: "Full Sun",
            water: "Deep watering twice a week",
            temp: "15°C - 25°C",
            care: "Prune in early spring. Mulch to retain moisture and suppress weeds. Watch for black spots or aphids and treat early."
        },
        { 
            name: "Basil", 
            category: "Herbs", 
            image: "🌿",
            light: "Full Sun / Partial Shade",
            water: "Frequent light watering",
            temp: "20°C - 30°C",
            care: "Pinch off the tips to encourage bushier growth. Harvest leaves frequently to prevent flowering, which makes leaves bitter."
        },
        { 
            name: "Chilli", 
            category: "Vegetables", 
            image: "🌶️",
            light: "Full Sun",
            water: "Moderate, once every 2 days",
            temp: "22°C - 32°C",
            care: "Ensure good air circulation. Apply organic compost every 20 days. Pick mature ones frequently to encourage more pods."
        },
        { 
            name: "Marigold", 
            category: "Flowers", 
            image: "🌼",
            light: "Full Sun",
            water: "Regularly during dry periods",
            temp: "18°C - 30°C",
            care: "Deadhead spent blooms to prolong flowering. Great for repelling garden pests naturally when planted near vegetables."
        }
    ];

    const filteredPlants = plantGuides.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ marginBottom: '3.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Plant Care Library</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>In-depth care protocols for your botanical collection.</p>
            </header>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for a plant species..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '1.25rem 1.25rem 1.25rem 3.5rem', 
                            borderRadius: '20px', 
                            border: '1px solid #e2e8f0', 
                            background: 'white',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                        }} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ 
                                padding: '1rem 1.75rem', 
                                borderRadius: '16px', 
                                border: 'none', 
                                fontWeight: 700,
                                background: selectedCategory === cat ? 'var(--primary)' : 'white',
                                color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plant Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {filteredPlants.map((plant, idx) => (
                    <div 
                        key={idx}
                        onClick={() => setSelectedPlant(plant)}
                        className="glass card-hover" 
                        style={{ padding: '2rem', borderRadius: '32px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>{plant.image}</div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem' }}>{plant.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{plant.category}</p>
                        
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '8px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b' }}><Sun size={18} /></div>
                            <div style={{ padding: '8px', borderRadius: '12px', background: '#f0f9ff', color: '#0ea5e9' }}><Droplets size={18} /></div>
                            <div style={{ padding: '8px', borderRadius: '12px', background: '#fff7ed', color: '#f97316' }}><Thermometer size={18} /></div>
                        </div>
                        
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                             Care Guide <ChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Plant Detail Modal */}
            {selectedPlant && (
                 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '700px', height: '90vh', overflowY: 'auto', padding: '4rem', borderRadius: '40px', position: 'relative' }}>
                        <button 
                            onClick={() => setSelectedPlant(null)}
                            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', borderRadius: '50%', padding: '12px', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>{selectedPlant.image}</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedPlant.name}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Expert Care Protocol</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                            <CareSpec icon={<Sun size={24} />} label="Light" value={selectedPlant.light} color="#eab308" />
                            <CareSpec icon={<Droplets size={24} />} label="Water" value={selectedPlant.water} color="#0ea5e9" />
                            <CareSpec icon={<Thermometer size={24} />} label="Temp" value={selectedPlant.temp} color="#f97316" />
                        </div>

                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Leaf size={24} color="var(--primary)" /> Professional Maintenance
                        </h4>
                        <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '32px', color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                            {selectedPlant.care}
                        </div>

                        <button 
                            onClick={() => setSelectedPlant(null)}
                            className="btn-primary" 
                            style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', borderRadius: '20px' }}
                        >
                            Got It, Thanks!
                        </button>
                    </div>
                 </div>
            )}
        </main>
    );
};

const CareSpec = ({ icon, label, value, color }: any) => (
    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
        <div style={{ color: color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{value}</div>
    </div>
);

export default PlantCareGuide;
