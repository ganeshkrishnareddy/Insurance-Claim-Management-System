import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';

const ClaimForm = () => {
    const navigate = useNavigate();
    const { addClaim } = useClaims();

    const [formData, setFormData] = useState({
        fullName: '',
        insuranceId: '',
        dateOfService: new Date().toISOString().split('T')[0] // Default to today
    });
    const [touched, setTouched] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const idRegex = /^INS-\d{4}$/;
    const isIdValid = idRegex.test(formData.insuranceId);
    const isFormValid = formData.fullName && isIdValid && formData.dateOfService;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            try {
                await addClaim(formData);
                setShowSuccess(true);
            } catch (error) {
                console.error("Error creating claim:", error);
                // Ideally show an error state here
            }
        }
    };

    if (showSuccess) {
        return (
            <div className="modal-overlay">
                <div className="modal animate-in" style={{ textAlign: 'center', padding: '40px 30px' }}>
                    <div style={{ color: '#10b981', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                        <CheckCircle size={64} className="icon-pulse" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Successfully Added!</h3>
                    <p style={{ color: '#666', marginBottom: '30px' }}>The new claim has been created and is ready for billing.</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary full-width">
                        Go to Dashboard
                    </button>
                    <style>{`
                        .icon-pulse { animation: pulse 1.5s infinite; }
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.1); opacity: 0.8; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-in">
            <header className="header">
                <button onClick={() => navigate('/')} className="btn-link" style={{ color: 'white' }}>
                    <ArrowLeft size={16} /> Dashboard
                </button>
                <h1>New Patient Claim</h1>
            </header>

            <form onSubmit={handleSubmit} className="form-card" style={{ padding: '30px' }}>
                <div className="form-group">
                    <label>Patient Name</label>
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

                <div className="form-group">
                    <label>Date of Service</label>
                    <input
                        type="date"
                        value={formData.dateOfService}
                        onChange={(e) => setFormData({ ...formData, dateOfService: e.target.value })}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Insurance ID</label>
                    <input
                        type="text"
                        value={formData.insuranceId}
                        onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value.toUpperCase() })}
                        onBlur={() => setTouched({ ...touched, insuranceId: true })}
                        required
                        placeholder="e.g. INS-1234"
                        className={touched.insuranceId && !isIdValid ? 'input-error' : ''}
                    />
                    <p className={`helper-text ${touched.insuranceId && !isIdValid ? 'error' : ''}`}>
                        Format: INS-XXXX (e.g. INS-1001)
                    </p>
                </div>

                <button type="submit" className="btn btn-primary full-width" disabled={!isFormValid} style={{ marginTop: '20px' }}>
                    Create Claim
                </button>
            </form>
        </div>
    );
};

export default ClaimForm;
