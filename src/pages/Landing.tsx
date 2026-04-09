import React from 'react'
import { Leaf, Droplets, Sun, Wind, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing: React.FC = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, padding: '1rem 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                        <Leaf size={32} />
                        <span>GrowSmart</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', fontWeight: 500, alignItems: 'center' }}>
                        <a href="#features" style={{ color: 'var(--text-muted)' }}>Features</a>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
                        <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px' }}>Join Now</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', background: 'radial-gradient(circle at top right, #e8f5e9, #f1f8e9)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
                            Nurture Your Garden with <span style={{ color: 'var(--primary-light)' }}>Intelligence</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-muted)' }}>
                            The all-in-one companion for modern horticulture. Monitor health, track growth, and receive smart reminders tailored to your ecosystem.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/signup" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>Start Free Trial</Link>
                            <button style={{ background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)', padding: '16px 32px', borderRadius: 'var(--radius)', fontWeight: 600 }}>Watch Demo</button>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className="glass" style={{ borderRadius: '40px', padding: '20px', boxShadow: 'var(--shadow)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1000" 
                                alt="Greenhouse" 
                                style={{ width: '100%', borderRadius: '30px', display: 'block' }}
                            />
                        </div>
                        {/* Status Floaties */}
                        <div className="glass" style={{ position: 'absolute', top: '10%', left: '-10%', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '10px', borderRadius: '50%' }}><Droplets size={20} /></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Soil Moisture</div>
                                <div style={{ fontWeight: 700 }}>68% Optimal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Preview */}
            <section id="features" style={{ padding: '100px 0', background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Everything you need to thrive</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Smart tools designed for every type of gardener.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        <FeatureCard icon={<Droplets />} title="Smart Watering" desc="Automatic reminders based on local weather and plant species." />
                        <FeatureCard icon={<Sun />} title="Sunlight Tracking" desc="Optimized placement recommendations for maximum growth." />
                        <FeatureCard icon={<Wind />} title="Ecosystem Monitor" desc="Real-time alerts for frost, heatwaves, and unexpected changes." />
                    </div>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div style={{ padding: '3rem 2rem', borderRadius: 'var(--radius)', background: 'var(--bg-main)', transition: 'transform 0.3s ease' }}>
            <div style={{ background: 'white', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {icon}
            </div>
            <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{desc}</p>
        </div>
    )
}

export default Landing;
