import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, Lock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';

const ForgotPassword: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form states
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await apiClient.post('Auth/forgot-password', { email });
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await apiClient.post('Auth/verify-otp', { email, otpCode: otp });
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await apiClient.post('Auth/reset-password', { email, otpCode: otp, newPassword });
            setSuccess('Password updated successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Reset failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '480px', padding: '3.5rem', borderRadius: '40px', boxShadow: 'var(--shadow)' }}>
                
                {/* Back Button */}
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <ArrowLeft size={18} /> {t('auth.back_to_login')}
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'rgba(33, 150, 243, 0.1)', width: '64px', height: '64px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        {step === 1 && <Mail size={30} />}
                        {step === 2 && <ShieldCheck size={30} />}
                        {step === 3 && <Lock size={30} />}
                    </div>
                    
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        {step === 1 && t('auth.reset_title')}
                        {step === 2 && t('auth.verify_title')}
                        {step === 3 && t('auth.new_pwd_title')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {step === 1 && t('auth.reset_subtitle')}
                        {step === 2 && t('auth.verify_subtitle', { email })}
                        {step === 3 && t('auth.new_pwd_subtitle')}
                    </p>
                </div>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
                {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} /> {success}
                </div>}

                {/* Step 1: Email Request */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '16px', border: '1px solid #eee', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? <Loader2 className="animate-spin" /> : t('auth.send_otp')}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <ShieldCheck style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="text" 
                                placeholder="6-Digit Code" 
                                maxLength={6}
                                required 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '16px', border: '1px solid #eee', outline: 'none', fontSize: '1rem', letterSpacing: '4px', fontWeight: 800 }}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Didn't receive the code? <button type="button" onClick={handleSendOtp} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Resend</button>
                        </p>
                    </form>
                )}

                {/* Step 3: Password Reset */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="password" 
                                placeholder="New Password" 
                                required 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '16px', border: '1px solid #eee', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                type="password" 
                                placeholder="Confirm New Password" 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '14px 14px 14px 50px', borderRadius: '16px', border: '1px solid #eee', outline: 'none', fontSize: '1rem' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
