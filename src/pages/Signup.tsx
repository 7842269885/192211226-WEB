import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('Auth/register', {
                name,
                email,
                passwordHash: password,
                // Removed manual string 'id' - backend expects int or auto-generated
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/profile-setup');
        } catch (err: any) {
            // Safely extract error message to prevent crash
            console.error('[DEBUG] Signup error:', err);
            const errorMsg = typeof err.response?.data === 'string' 
                ? err.response.data 
                : typeof err.response?.data === 'object'
                ? JSON.stringify(err.response.data)
                : 'Registration failed. Please try again.';
            setError(errorMsg);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem' }}>
                        <UserPlus size={28} />
                    </div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>Start Growing</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join the GrowSmart community today</p>
                </div>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Join GrowSmart'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
