import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <button 
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #eee', padding: '0.75rem 1.25rem', borderRadius: '12px', cursor: 'pointer', marginBottom: '2rem', fontWeight: 600 }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Shield size={32} color="var(--primary)" />
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Privacy Policy</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Last updated: April 7, 2026</p>
            </header>

            <div className="glass" style={{ padding: '3rem', borderRadius: '32px', maxWidth: '900px', lineHeight: 1.8, color: 'var(--text-main)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>1. Information We Collect</h2>
                    <p>GrowSmart collects information to provide better services to all our users. This includes:</p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li><strong>Personal Information:</strong> Name, email address, and phone number provided during registration.</li>
                        <li><strong>Agricultural Data:</strong> Images of your crops, soil types, and land dimensions uploaded for AI analysis.</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, and IP address for security and optimization.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>2. How We Use Information</h2>
                    <p>We use the information we collect to operate, maintain, and provide the features and functionality of the Service, including:</p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li>Processing your plant identification and health analysis requests via Gemini AI.</li>
                        <li>Generating localized weather alerts and agricultural recommendations.</li>
                        <li>Sending reminders and notifications relevant to your garden's status.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>3. Data Security</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is stored securely and access is restricted to authorized personnel and automated AI processing systems.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>4. AI Processing Disclaimer</h2>
                    <p>By using our AI tools (Garden Planner, Health Scan), you acknowledge that images are processed by third-party AI models (Google Gemini) to provide horticultural insights. While we strive for accuracy, AI results should be verified with local agricultural experts.</p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>5. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at support@growsmart.ai.</p>
                </section>
            </div>
        </main>
    );
};

export default Privacy;
