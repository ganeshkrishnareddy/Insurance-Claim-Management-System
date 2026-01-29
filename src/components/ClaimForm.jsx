import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, User, Calendar, CreditCard } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';

const ClaimForm = () => {
    const navigate = useNavigate();
    const { addClaim } = useClaims();

    const [formData, setFormData] = useState({
        fullName: '',
        insuranceId: '',
        dateOfService: new Date().toISOString().split('T')[0]
    });
    const [touched, setTouched] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const idRegex = /^INS-\d{4}$/;
    const isIdValid = idRegex.test(formData.insuranceId);
    const isFormValid = formData.fullName && isIdValid && formData.dateOfService;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid && !isSubmitting) {
            setIsSubmitting(true);
            try {
                await addClaim(formData);
                setShowSuccess(true);
            } catch (error) {
                console.error("Error creating claim:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (showSuccess) {
        return (
            <div className="form-page">
                <div className="form-card animate-in" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <div style={{ color: 'var(--success)', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <CheckCircle size={72} className="icon-pulse" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-main)' }}>Claim Created!</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The new claim has been added and is ready for billing.</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary full-width">
                        Go to Dashboard
                    </button>
                </div>
                <style>{`
                    .icon-pulse { animation: pulse 1.5s infinite; }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="form-page">
            {/* Header */}
            <div className="form-header">
                <button onClick={() => navigate('/')} className="back-btn" title="Back to Dashboard">
                    <ArrowLeft size={20} />
                </button>
                <h1>New Patient Claim</h1>
            </div>

            {/* Form Card */}
            <div className="form-card animate-in">
                <div className="form-card-header">
                    <h2>Patient Claim Details</h2>
                    <p>Fill in the required information to create a new claim</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Patient Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                onBlur={() => setTouched({ ...touched, fullName: true })}
                                required
                                placeholder="e.g. John Doe"
                                className={touched.fullName && !formData.fullName ? 'input-error' : ''}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date of Service</label>
                        <div className="input-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <input
                                type="date"
                                value={formData.dateOfService}
                                onChange={(e) => setFormData({ ...formData, dateOfService: e.target.value })}
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <p className="helper-text">Date patient received treatment</p>
                    </div>

                    <div className="form-group">
                        <label>Insurance ID</label>
                        <div className="input-wrapper">
                            <CreditCard size={18} className="input-icon" />
                            <input
                                type="text"
                                value={formData.insuranceId}
                                onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value.toUpperCase() })}
                                onBlur={() => setTouched({ ...touched, insuranceId: true })}
                                required
                                placeholder="e.g. INS-1234"
                                className={touched.insuranceId && !isIdValid ? 'input-error' : (touched.insuranceId && isIdValid ? 'input-success' : '')}
                            />
                            {touched.insuranceId && isIdValid && (
                                <CheckCircle size={18} className="input-icon-right" style={{ color: 'var(--success)' }} />
                            )}
                        </div>
                        <p className={`helper-text ${touched.insuranceId && !isIdValid ? 'error' : ''}`}>
                            Format: INS-XXXX (e.g. INS-1001)
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary full-width"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Claim'}
                    </button>
                </form>
            </div>

            <style>{`
                .form-page {
                    min-height: 100vh;
                    background: var(--bg-soft);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .form-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                    max-width: 480px;
                    margin-bottom: 24px;
                }
                .form-header h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .back-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid var(--border-color);
                    background: var(--card-bg);
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }
                .form-card {
                    background: var(--card-bg);
                    border-radius: 16px;
                    padding: 32px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: 1px solid var(--border-color);
                }
                .form-card-header {
                    margin-bottom: 28px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--border-color);
                }
                .form-card-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0 0 6px 0;
                }
                .form-card-header p {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin: 0;
                }
                .form-group {
                    margin-bottom: 24px;
                }
                .form-group label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-main);
                    margin-bottom: 8px;
                }
                .input-wrapper {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }
                .input-icon-right {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .input-wrapper input {
                    width: 100%;
                    padding: 14px 14px 14px 46px;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    font-size: 1rem;
                    background: var(--bg-soft);
                    color: var(--text-main);
                    transition: all 0.2s;
                }
                .input-wrapper input::placeholder {
                    color: var(--text-muted);
                    opacity: 0.7;
                }
                .input-wrapper input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: var(--card-bg);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
                }
                .input-wrapper input.input-error {
                    border-color: var(--danger);
                }
                .input-wrapper input.input-error:focus {
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
                }
                .input-wrapper input.input-success {
                    border-color: var(--success);
                    padding-right: 46px;
                }
                .helper-text {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-top: 6px;
                }
                .helper-text.error {
                    color: var(--danger);
                }
                .btn.btn-primary {
                    padding: 14px 24px;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 8px;
                }
                .btn.btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default ClaimForm;
