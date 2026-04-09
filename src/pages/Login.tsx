import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';

const Login: React.FC = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('Auth/login', {
                email,
                password: password // Updated: Backend expects 'password' in LoginDto
            });
            
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/dashboard');
            }
        } catch (err: any) {
            // Safely extract error message to prevent crash
            console.error('[DEBUG] Login error:', err);
            const errorMsg = typeof err.response?.data === 'string' 
                ? err.response.data 
                : typeof err.response?.data === 'object'
                ? JSON.stringify(err.response.data)
                : 'Login failed. Please check your credentials.';
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
                        <LogIn size={28} />
                    </div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to manage your garden</p>
                </div>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

                    <div style={{ textAlign: 'right', marginTop: '-0.75rem' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                            {t('auth.forgot_pwd')}
                        </Link>
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
