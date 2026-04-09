import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Leaf, 
    LogOut, 
    Plus, 
    Cloud, 
    Thermometer, 
    Droplets, 
    CheckCircle, 
    AlertCircle, 
    Camera, 
    Activity, 
    Sparkles, 
    ChevronRight, 
    Trash2, 
    Info, 
    Map, 
    BookOpen, 
    Heart,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';

const Dashboard: React.FC = () => {
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [plants, setPlants] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [insights, setInsights] = useState<string[]>([]);
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [showAddModal, setShowAddModal] = useState(false);
    const [newPlant, setNewPlant] = useState({
        name: '',
        species: '',
        category: 'Flower',
        waterFrequencyDays: 3,
        sunlightRequirement: 'Full Sun',
        isIndoor: true
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchAllData(parsedUser.id);
    }, [navigate]);

    const fetchAllData = async (userId: string) => {
        setLoading(true);
        try {
            const [plantsRes, summaryRes, tasksRes, insightsRes, weatherRes] = await Promise.all([
                apiClient.get(`Plants/user/${userId}`),
                apiClient.get(`Garden/summary/${userId}`),
                apiClient.get(`Tasks/today/${userId}`),
                apiClient.get(`Insights/garden`),
                apiClient.get(`Weather/current`).catch(() => ({ data: null }))
            ]);

            setPlants(plantsRes.data || []);
            setSummary(summaryRes.data || null);
            setTasks(tasksRes.data || []);
            setInsights(insightsRes.data || []);
            setWeather(weatherRes.data || null);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlant = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('Plants', {
                ...newPlant,
                userId: user.id,
                datePlanted: new Date().toISOString(),
                healthStatus: 'Healthy'
            });
            setShowAddModal(false);
            fetchAllData(user.id);
            setNewPlant({ name: '', species: '', category: 'Flower', waterFrequencyDays: 3, sunlightRequirement: 'Full Sun', isIndoor: true });
        } catch (err) {
            console.error('Error adding plant', err);
        }
    };

    const handleDeletePlant = async (plantId: string) => {
        if (!window.confirm('Are you sure you want to remove this plant from your garden?')) return;
        try {
            await apiClient.delete(`Plants/${plantId}`);
            fetchAllData(user.id);
            if (selectedPlant?.id === plantId) setSelectedPlant(null);
        } catch (err) {
            console.error('Error deleting plant', err);
        }
    };

    const handleCompleteTask = async (plantId: number, taskType: string) => {
        try {
            await apiClient.post(`Tasks/complete/${plantId}/${taskType}`);
            // Optimistic Update: Remove the task from local state immediately
            setTasks(prev => prev.filter(t => !(t.id === plantId && t.type === taskType)));
            // Refresh summary data to reflect health improvements
            const summaryRes = await apiClient.get(`Garden/summary/${user.id}`);
            setSummary(summaryRes.data || null);
        } catch (err) {
            console.error('Error completing task', err);
            alert('Failed to complete task. Please try again.');
        }
    };

    const handleUpdatePlant = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.put(`Plants/${selectedPlant.id}`, selectedPlant);
            setIsEditing(false);
            fetchAllData(user.id);
        } catch (err) {
            console.error('Error updating plant', err);
        }
    };

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>
                        {t('dashboard.greeting', { name: user?.name || 'Gardener' })}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('dashboard.subtitle')}</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Add Plant
                </button>
            </header>

            {/* Quick Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard 
                    icon={<Thermometer color="#f44336" />} 
                    label={t('dashboard.temp')} 
                    value={weather ? `${weather.temperature || 28}°C` : '28°C'} 
                />
                <StatusCard 
                    icon={<Droplets color="var(--primary)" />} 
                    label={t('dashboard.status')} 
                    value={summary ? `${summary.healthyPlants || 0} Healthy` : '0 Healthy'} 
                    sub="Stable"
                />
                <StatusCard 
                    icon={<AlertTriangle color="#ff9800" />} 
                    label={t('dashboard.attention')} 
                    value={summary ? `${summary.needsAttention || 0} Plants` : '0 Plants'} 
                    sub="Check details"
                />
                <StatusCard 
                    icon={<Cloud color="#90a4ae" />} 
                    label={t('sidebar.weather')} 
                    value={weather ? (weather.condition || 'Sunny') : 'Sunny'} 
                    sub="Clear Skies"
                />
            </div>

            {/* Main Content Grid: Tasks (2fr) and Quick Tools (1fr) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start', marginBottom: '3rem' }}>
                {/* Tasks Section */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('dashboard.tasks')}</h2>
                        <button style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {t('dashboard.view_all')} <ArrowUpRight size={16} />
                        </button>
                    </div>
                    
                    <div className="glass" style={{ padding: '2rem', borderRadius: '32px', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
                        {tasks.length === 0 ? (
                            <div style={{ textAlign: 'center', margin: 'auto' }}>
                                <CheckCircle size={48} color="#4caf50" style={{ margin: '0 auto 1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{t('dashboard.all_set')}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {tasks.map((task: any) => (
                                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
                                        <div style={{ padding: '10px', background: 'var(--primary-light)', borderRadius: '12px' }}>
                                            <Droplets size={20} color="var(--primary)" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700 }}>{task.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.time || 'Today'}</div>
                                        </div>
                                        <button 
                                            onClick={() => handleCompleteTask(task.id, task.type)}
                                            style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
                                        >
                                            {t('common.done')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Garden Insights under Tasks */}
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1.5rem' }}>{t('dashboard.insights')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {insights.map((insight, i) => (
                            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    Smart Tip
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{insight}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Tools Section */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t('dashboard.quick_tools')}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ToolCard 
                            icon={<Camera color="white" />} 
                            title={t('dashboard.identify')} 
                            desc={t('dashboard.identify_desc')} 
                            color="var(--primary)" 
                            onClick={() => navigate('/identify')}
                        />
                        <ToolCard 
                            icon={<Activity color="white" />} 
                            title={t('dashboard.health')} 
                            desc={t('dashboard.health_desc')} 
                            color="#4caf50" 
                            onClick={() => navigate('/identify?mode=health')}
                        />
                        <ToolCard 
                            icon={<Map color="white" />} 
                            title={t('dashboard.planner')} 
                            desc={t('dashboard.planner_desc')} 
                            color="#8e24aa" 
                            onClick={() => navigate('/planner')}
                        />
                         <ToolCard 
                            icon={<BookOpen color="white" />} 
                            title={t('dashboard.guides')} 
                            desc={t('dashboard.guides_desc')} 
                            color="#f57c00" 
                            onClick={() => navigate('/guides/cultivation')}
                        />
                        <ToolCard 
                            icon={<Heart color="white" />} 
                            title={t('sidebar.care')} 
                            desc={t('dashboard.care_desc')} 
                            color="#e91e63" 
                            onClick={() => navigate('/guides/care')}
                        />
                    </div>
                </section>
            </div>

            {/* Plant Inventory Section */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Plants ({plants.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {plants.map((plant: any) => (
                    <div key={plant.id} className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                        <div style={{ background: 'var(--bg-main)', height: '160px', borderRadius: '16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={48} color="var(--primary-light)" />
                        </div>
                        <h3 style={{ marginBottom: '0.25rem' }}>{plant.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{plant.species}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                                {plant.healthStatus}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setSelectedPlant(plant)} style={{ color: 'var(--primary)', background: 'transparent', padding: '4px', border: 'none', cursor: 'pointer' }}>
                                    <Info size={18} />
                                </button>
                                <button onClick={() => handleDeletePlant(plant.id)} style={{ color: '#c62828', background: 'transparent', padding: '4px', border: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plant Detail Modal */}
            {selectedPlant && (
                 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '32px', position: 'relative' }}>
                        <button 
                            onClick={() => setSelectedPlant(null)}
                            style={{ position: 'absolute', top: '1.5rem', right: '2rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>
                        
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ width: '120px', height: '120px', background: 'var(--bg-main)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Leaf size={60} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                {isEditing ? (
                                    <>
                                        <input 
                                            value={selectedPlant.name} 
                                            onChange={e => setSelectedPlant({...selectedPlant, name: e.target.value})}
                                            style={{ width: '100%', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                        <input 
                                            value={selectedPlant.species} 
                                            onChange={e => setSelectedPlant({...selectedPlant, species: e.target.value})}
                                            style={{ width: '100%', fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{selectedPlant.name}</h2>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedPlant.species}</p>
                                    </>
                                )}
                                <span style={{ fontSize: '0.9rem', background: '#e8f5e9', color: '#2e7d32', padding: '6px 16px', borderRadius: '20px', fontWeight: 700 }}>
                                    {selectedPlant.healthStatus}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <DetailRow label="Category" value={selectedPlant.category} />
                            <DetailRow label="Watering" value={`Every ${selectedPlant.waterFrequencyDays} days`} />
                            <DetailRow label="Sunlight" value={selectedPlant.sunlightRequirement} />
                            <DetailRow label="Environment" value={selectedPlant.isIndoor ? 'Indoor' : 'Outdoor'} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {isEditing ? (
                                <>
                                    <button onClick={handleUpdatePlant} className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                    <button onClick={() => setIsEditing(false)} style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #ddd', background: 'transparent' }}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ flex: 1 }}>Edit Plant</button>
                                    <button 
                                        onClick={() => handleDeletePlant(selectedPlant.id)} 
                                        style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #ffcdd2', background: '#fff5f5', color: '#c62828', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                 </div>
            )}

            {/* Add Plant Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Add New Plant</h2>
                        <form onSubmit={handleAddPlant} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <input type="text" placeholder="Plant Name" required value={newPlant.name} onChange={e => setNewPlant({...newPlant, name: e.target.value})} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #eee' }} />
                            <input type="text" placeholder="Species (e.g. Rosa Indica)" required value={newPlant.species} onChange={e => setNewPlant({...newPlant, species: e.target.value})} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #eee' }} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select value={newPlant.category} onChange={e => setNewPlant({...newPlant, category: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
                                    <option>Flower</option>
                                    <option>Vegetable</option>
                                    <option>Herb</option>
                                    <option>Succulent</option>
                                </select>
                                <input type="number" placeholder="Watering Days" required value={newPlant.waterFrequencyDays} onChange={e => setNewPlant({...newPlant, waterFrequencyDays: parseInt(e.target.value)})} style={{ width: '120px', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 20px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Add to Garden</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

const StatCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
        </div>
    </div>
);

const StatusCard = ({ icon, label, value, sub }: { icon: any, label: string, value: string, subText?: string, sub?: string }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{sub}</div>
        </div>
    </div>
);

const ToolCard = ({ icon, title, desc, color, onClick }: any) => (
    <div 
        onClick={onClick}
        className="glass" 
        style={{ 
            padding: '1.25rem 1.5rem', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255,255,255,0.3)'
        }}
    >
        <div style={{ background: color, padding: '10px', borderRadius: '12px', boxShadow: `0 4px 12px ${color}33` }}>{icon}</div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
);

const AlertTriangle = ({ size, color }: any) => <AlertCircle size={size} color={color} />;
const X = ({ size }: any) => <LogOut size={size} style={{ transform: 'rotate(180deg)' }} />;

export default Dashboard;
