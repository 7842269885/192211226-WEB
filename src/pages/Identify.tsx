import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Camera, Upload, Search, Activity, CheckCircle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import apiClient from '../api/apiClient';

const Identify: React.FC = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'identify';
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log(`[DEBUG] File selected: ${file.name}, Size: ${file.size} bytes`);
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(`[DEBUG] Image read complete. Base64 length: ${reader.result?.toString().length}`);
                setSelectedImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };


    const runAnalysis = async () => {
        if (!selectedImage) return;
        setAnalyzing(true);
        setResult(null);
        try {
            const endpoint = mode === 'health' ? 'Plant/health' : 'Plant/identify';
            const response = await apiClient.post(endpoint, {
                 image: selectedImage.split(',')[1],
                 latitude: 0,
                 longitude: 0
            });
            
            console.log('[DEBUG] API Response:', response.data);
            setResult(response.data);
        } catch (err: any) {
            console.error('Analysis failed', err);
            setResult({
                status: 'Error',
                isError: true,
                description: 'We encountered an error while connecting to the identification servers. Please check your connection and try again.'
            });
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <main style={{ flex: 1, padding: '3rem', marginLeft: '280px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800 }}>
                    {mode === 'health' ? 'Health Scanner' : 'Plant Identifier'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {mode === 'health' 
                        ? 'AI-powered diagnostic for agricultural crop health and disease detection.' 
                        : 'Precision identification for gardens and large-scale agricultural specimens.'}
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.2fr' : '1fr', gap: '3rem', transition: 'all 0.5s ease' }}>
                {/* Upload Section */}
                <section>
                    <div 
                        className="glass" 
                        style={{ 
                            padding: '3rem', 
                            borderRadius: '32px', 
                            textAlign: 'center',
                            border: '2px dashed #cbd5e1',
                            background: selectedImage ? 'white' : 'rgba(255,255,255,0.5)',
                            position: 'relative'
                        }}
                    >
                        {!selectedImage ? (
                            <>
                                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Camera size={40} />
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>Analyze Specimen</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Upload or drag a photo of a leaf or plant</p>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                                />
                                <button className="btn-primary" style={{ pointerEvents: 'none' }}>Choose Image</button>
                            </>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <img src={selectedImage} alt="Preview" style={{ width: '100%', maxHeight: '420px', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                <button 
                                    onClick={() => { setSelectedImage(null); setResult(null); }}
                                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                                >
                                    ✕
                                </button>
                                {!result && (
                                    <button 
                                        onClick={runAnalysis} 
                                        disabled={analyzing}
                                        className="btn-primary" 
                                        style={{ marginTop: '2rem', width: '100%', height: '60px', fontSize: '1.1rem', borderRadius: '18px' }}
                                    >
                                        {analyzing ? 'Processing Analysis...' : `Begin ${mode === 'health' ? 'Health Scan' : 'Identification'}`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Result Section */}
                {result && (
                    <section style={{ animation: 'fadeIn 0.5s ease' }}>
                        <div className="glass" style={{ padding: '3rem', borderRadius: '32px', height: '100%', border: result.isPlant === false ? '2px solid #fbbf24' : 'none' }}>
                            
                            {/* Non-Plant Warning */}
                            {result.isPlant === false ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ background: '#fffbeb', color: '#d97706', width: '70px', height: '70px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <AlertCircle size={36} />
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#92400e', marginBottom: '1rem' }}>Specimen Rejected</h2>
                                    <p style={{ color: '#b45309', lineHeight: 1.6, fontSize: '1.1rem', marginBottom: '2rem' }}>
                                        {result.description || "The analysis engine could not find any biological plant features in this image. Ensure you upload a clear photo of a leaf or plant."}
                                    </p>
                                    <button onClick={() => { setSelectedImage(null); setResult(null); }} className="btn-primary" style={{ background: '#92400e', width: '100%' }}>Try Different Photo</button>
                                </div>
                            ) : result.isError ? (
                                <div style={{ textAlign: 'center' }}>
                                    <Activity size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                                    <h3>Identification Error</h3>
                                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>{result.description}</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ background: '#ecfdf5', color: '#10b981', padding: '12px', borderRadius: '15px' }}><CheckCircle size={28} /></div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>System Verification</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>
                                                {result.isAgricultural ? 'Agricultural Verified' : 'Specimen Identified'}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>{result.commonName}</h2>
                                                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '1.1rem' }}>{result.scientificName}</p>
                                            </div>
                                            {result.isAgricultural && (
                                                <div style={{ background: '#FEF3C7', color: '#D97706', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', border: '1px solid #FCD34D' }}>
                                                    FARM-GRADE DATA
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                            <span style={{ fontSize: '0.85rem', background: 'var(--bg-main)', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                                                {Math.round(result.confidence * 100)}% Confidence
                                            </span>
                                        </div>
                                        <p style={{ marginTop: '1.5rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{result.description}</p>
                                    </div>

                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Info size={18} color="var(--primary)" />
                                        Advanced Care Directives
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {result.recommendations?.map((rec: string, i: number) => (
                                            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'white', borderRadius: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                                    {i + 1}
                                                </div>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{rec}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="btn-primary" style={{ width: '100%', marginTop: '3rem', background: '#f8fafc', color: 'var(--text-main)', border: '1px solid #e2e8f0', height: '54px', fontWeight: 600 }}>
                                        Archive to My Farm Logs
                                    </button>
                                </>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default Identify;
