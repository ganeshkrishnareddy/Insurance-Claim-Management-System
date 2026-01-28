import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, CheckCircle, Clock, XCircle, CreditCard, Activity, DollarSign, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { useAuth } from '../context/AuthContext';
import { calculateTotal, calculatePending, formatCurrency, formatDate, getStatusColor } from '../utils';

const ClaimDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { claims, updateClaimStatus, addBill, addAdvance, updateSettlement } = useClaims();
    const { user } = useAuth();
    const claim = claims.find(c => c.id === id);

    // Local state for modals
    const [showBillModal, setShowBillModal] = useState(false);
    const [billForm, setBillForm] = useState({ description: '', amount: '', category: 'Consultation' });

    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [advanceForm, setAdvanceForm] = useState({ description: '', amount: '' });

    const [showPayModal, setShowPayModal] = useState(false);
    const [payAmount, setPayAmount] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    if (!claim) return <div className="container">Claim not found</div>;

    const totalBills = calculateTotal(claim.bills);
    const totalAdvances = calculateTotal(claim.advances || []);
    const totalPayable = totalBills - totalAdvances;
    const pending = calculatePending(totalPayable, claim.paidAmount);

    const handleAddBill = (e) => {
        e.preventDefault();
        if (billForm.description && billForm.amount) {
            addBill(claim.id, { ...billForm, amount: parseFloat(billForm.amount) });
            setBillForm({ description: '', amount: '', category: 'Consultation' });
            setShowBillModal(false);
        }
    };

    const handleAddAdvance = (e) => {
        e.preventDefault();
        if (advanceForm.description && advanceForm.amount) {
            addAdvance(claim.id, { ...advanceForm, amount: parseFloat(advanceForm.amount) });
            setAdvanceForm({ description: '', amount: '' });
            setShowAdvanceModal(false);
        }
    };

    const handlePay = (e) => {
        e.preventDefault();
        if (payAmount) {
            updateSettlement(claim.id, parseFloat(payAmount));
            setPayAmount('');
            setShowPayModal(false);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Consultation': return <Activity size={18} />;
            case 'Laboratory': return <Activity size={18} />;
            case 'Pharmacy': return <CreditCard size={18} />;
            default: return <CreditCard size={18} />;
        }
    };

    const steps = ['draft', 'submitted', 'approved', 'settled'];
    const currentStepIndex = steps.indexOf(claim.status === 'partiallySettled' ? 'approved' : claim.status === 'rejected' ? 'submitted' : claim.status);

    return (
        <div className="container animate-in">
            <button onClick={() => navigate('/')} className="btn-link">
                <ArrowLeft size={16} /> Dashboard
            </button>

            <div className="details-header">
                <div>
                    <h1>{claim.patient.fullName}</h1>
                    <div className="id-row" style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>
                        <span>ID: {claim.patient.insuranceId}</span>
                        <span>📅 {formatDate(claim.serviceDate)}</span>
                    </div>
                </div>
                <div className="status-badge large" style={{ backgroundColor: getStatusColor(claim.status) }}>
                    {claim.status}
                </div>
            </div>

            {/* Status Timeline */}
            <div className="timeline">
                {steps.map((step, index) => (
                    <div key={step} className={`timeline-step ${index <= currentStepIndex ? 'active' : ''} ${claim.status === 'rejected' && step === 'submitted' ? 'rejected' : ''}`}>
                        <div className="step-dot">
                            {index < currentStepIndex ? <CheckCircle size={14} /> : (index === currentStepIndex && claim.status === 'rejected' ? <XCircle size={14} /> : <div className="dot-inner"></div>)}
                        </div>
                        <span className="step-label">{step}</span>
                    </div>
                ))}
            </div>

            <div className="financial-summary">
                <div className="summary-item highlight">
                    <span className="label">💰 Total Billed</span>
                    <span className="value">{formatCurrency(totalBills)}</span>
                </div>
                <div className="summary-item highlight">
                    <span className="label">⏳ Pending</span>
                    <span className="value orange">{formatCurrency(pending)}</span>
                </div>
                <div className="summary-item highlight">
                    <span className="label">✅ Paid</span>
                    <span className="value green">{formatCurrency(claim.paidAmount)}</span>
                </div>
            </div>

            <div className="actions-bar">
                {user?.role === 'user' && claim.status === 'draft' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowConfirmModal(true)}
                            disabled={claim.bills.length === 0}
                        >
                            Submit Claim
                        </button>
                        {claim.bills.length === 0 && (
                            <span className="text-small" style={{ color: '#ef4444' }}>
                                <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                Add a bill to submit
                            </span>
                        )}
                    </div>
                )}
                {user?.role === 'admin' && claim.status === 'submitted' && (
                    <>
                        <button className="btn btn-success" onClick={() => updateClaimStatus(claim.id, 'approved')}>Approve</button>
                        <button className="btn btn-danger" onClick={() => updateClaimStatus(claim.id, 'rejected')}>Reject</button>
                    </>
                )}
                {user?.role === 'admin' && (claim.status === 'approved' || claim.status === 'partiallySettled') && (
                    <button className="btn btn-primary" onClick={() => setShowPayModal(true)}>Update Payment</button>
                )}
            </div>

            <div className="section-header">
                <h2>Bills Management</h2>
                {claim.status === 'draft' && (
                    <button className="btn btn-outline" onClick={() => setShowBillModal(true)}>
                        <Plus size={16} /> Add Bill
                    </button>
                )}
            </div>

            {claim.bills.length === 0 ? (
                <div className="empty-state-small">
                    <p>No bills added yet. Manage all expenses here.</p>
                </div>
            ) : (
                <ul className="bills-list">
                    {claim.bills.map(bill => (
                        <li key={bill.id} className="bill-item">
                            <div className="bill-icon-wrap">
                                {getCategoryIcon(bill.category || 'Consultation')}
                            </div>
                            <div className="bill-main">
                                <span className="bill-desc">{bill.description}</span>
                                <span className="bill-date">{formatDate(bill.date)}</span>
                            </div>
                            <div className="bill-right">
                                <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="section-header" style={{ marginTop: '24px' }}>
                <h2>Advances</h2>
                {claim.status === 'draft' && (
                    <button className="btn btn-outline" onClick={() => setShowAdvanceModal(true)}>
                        <Plus size={16} /> Add Advance
                    </button>
                )}
            </div>

            {(claim.advances || []).length === 0 ? (
                <p className="no-data">No advances recorded.</p>
            ) : (
                <ul className="bills-list">
                    {claim.advances.map(adv => (
                        <li key={adv.id} className="bill-item">
                            <div className="bill-main">
                                <span className="bill-desc">{adv.description}</span>
                                <span className="bill-date">{formatDate(adv.date)}</span>
                            </div>
                            <span className="bill-amount">{formatCurrency(adv.amount)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modals (Simple overlays) */}
            {showBillModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add New Bill</h3>
                        <form onSubmit={handleAddBill}>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" value={billForm.description} onChange={e => setBillForm({ ...billForm, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input type="number" step="0.01" value={billForm.amount} onChange={e => setBillForm({ ...billForm, amount: e.target.value })} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowBillModal(false)} className="btn btn-text">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAdvanceModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Advance Payment</h3>
                        <form onSubmit={handleAddAdvance}>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" value={advanceForm.description} onChange={e => setAdvanceForm({ ...advanceForm, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input type="number" step="0.01" value={advanceForm.amount} onChange={e => setAdvanceForm({ ...advanceForm, amount: e.target.value })} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAdvanceModal(false)} className="btn btn-text">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPayModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Update Settlement</h3>
                        <p>Current Pending: {formatCurrency(pending)}</p>
                        <form onSubmit={handlePay}>
                            <div className="form-group">
                                <label>Payment Amount</label>
                                <input type="number" step="0.01" max={pending} value={payAmount} onChange={e => setPayAmount(e.target.value)} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowPayModal(false)} className="btn btn-text">Cancel</button>
                                <button type="submit" className="btn btn-primary">Pay</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Submit Claim?</h3>
                        <p>Are you sure you want to submit this claim? You won't be able to edit bills after submission.</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirmModal(false)} className="btn btn-text">Cancel</button>
                            <button onClick={() => {
                                updateClaimStatus(claim.id, 'submitted');
                                setShowConfirmModal(false);
                            }} className="btn btn-primary">Confirm Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClaimDetails;
