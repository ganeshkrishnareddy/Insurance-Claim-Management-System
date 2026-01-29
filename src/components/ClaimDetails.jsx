import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus, ArrowLeft, CheckCircle, Clock,
    XCircle, CreditCard, Activity, DollarSign,
    Trash2, Edit2, AlertCircle, FileText, Printer
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { useAuth } from '../context/AuthContext';
import { calculateTotal, calculatePending, formatCurrency, formatDate, getStatusColor } from '../utils';
import Footer from './Footer';

const ClaimDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { claims, updateClaimStatus, addBill, addAdvance, updateSettlement } = useClaims();
    const { user } = useAuth();
    const claim = claims.find(c => c.id === id);

    // Local state for modals
    const [showBillModal, setShowBillModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [billForm, setBillForm] = useState({ description: '', amount: '', category: 'Consultation' });
    const [paymentAmount, setPaymentAmount] = useState('');

    if (!claim) return <div className="container">Claim not found</div>;

    const totalBills = calculateTotal(claim.bills);
    const totalAdvances = calculateTotal(claim.advances || []);
    const totalSettlements = claim.paidAmount || 0;
    const pendingSettlement = totalBills - totalAdvances - totalSettlements;

    const handleAddBill = (e) => {
        e.preventDefault();
        if (billForm.description && billForm.amount) {
            addBill(claim.id, { ...billForm, amount: parseFloat(billForm.amount), id: Date.now().toString(), date: new Date().toISOString() });
            setBillForm({ description: '', amount: '', category: 'Consultation' });
            setShowBillModal(false);
        }
    };

    const handleUpdatePayment = (e) => {
        e.preventDefault();
        if (paymentAmount) {
            updateSettlement(claim.id, parseFloat(paymentAmount));
            setPaymentAmount('');
            setShowPaymentModal(false);
        }
    };

    return (
        <div className="dashboard animate-in">
            <header className="header" style={{ background: 'white', color: 'var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} className="back-btn" title="Back">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ color: 'var(--primary)', margin: 0 }}>{claim.patient.insuranceId}</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-text glass" style={{ padding: '8px', borderRadius: '8px' }}>
                        <Edit2 size={20} color="var(--text-muted)" />
                    </button>
                    <button className="btn-text glass" style={{ padding: '8px', borderRadius: '8px' }}>
                        <Printer size={20} color="var(--text-muted)" />
                    </button>
                </div>
            </header>

            <main style={{ padding: '40px' }}>
                <div className="main-card animate-in" style={{ padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{claim.patient.insuranceId}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Created: {formatDate(claim.createdAt || claim.serviceDate)}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last Updated: {formatDate(claim.updatedAt)}</p>
                    </div>
                    <span className={`badge ${claim.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '1rem', padding: '10px 24px' }}>
                        {claim.status}
                    </span>
                </div>

                <div className="stats-grid" style={{ padding: 0, marginTop: 0, marginBottom: '40px' }}>
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">Total Bills</span>
                            <div className="stat-icon-wrap" style={{ background: '#eff6ff' }}>
                                <FileText size={20} color="#3b82f6" />
                            </div>
                        </div>
                        <span className="stat-value" style={{ color: '#3182ce' }}>{formatCurrency(totalBills)}</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">Advances</span>
                            <div className="stat-icon-wrap" style={{ background: '#eff6ff' }}>
                                <CreditCard size={20} color="#3b82f6" />
                            </div>
                        </div>
                        <span className="stat-value" style={{ color: '#3182ce' }}>{formatCurrency(totalAdvances)}</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">Settlements</span>
                            <div className="stat-icon-wrap" style={{ background: '#dcfce7' }}>
                                <CheckCircle size={20} color="#10b981" />
                            </div>
                        </div>
                        <span className="stat-value" style={{ color: '#10b981' }}>{formatCurrency(totalSettlements)}</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">Pending</span>
                            <div className="stat-icon-wrap" style={{ background: '#fef3c7' }}>
                                <Clock size={20} color="#f59e0b" />
                            </div>
                        </div>
                        <span className="stat-value" style={{ color: '#3182ce' }}>{formatCurrency(pendingSettlement)}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section className="info-card">
                        <h2>Patient Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Name</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.fullName}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Age</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.age || '45'} years</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Gender</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.gender || 'Male'}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Contact</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.phone || '+91 98765 43210'}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Address</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.address || 'Mumbai, Maharashtra'}</p>
                            </div>
                        </div>
                    </section>

                    <section className="info-card">
                        <h2>Insurance Details</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Provider</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.provider || 'Star Health Insurance'}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Policy Number</p>
                                <p style={{ fontWeight: '600' }}>{claim.patient.policyNumber || 'SH-2024-9876'}</p>
                            </div>
                        </div>
                    </section>

                    <section className="info-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h2 style={{ margin: 0 }}>Bills Breakdown</h2>
                                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>{claim.bills.length}</span>
                            </div>
                            {/* Add Bill Button */}
                            <button onClick={() => setShowBillModal(true)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                <Plus size={16} /> Add Bill
                            </button>
                        </div>
                        <div className="bills-list-new">
                            {claim.bills.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No bills added yet.</p>
                            ) : (
                                claim.bills.map(bill => (
                                    <div key={bill.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div className="claim-avatar" style={{ background: '#f1f5f9', color: 'var(--primary)', width: '40px', height: '40px', fontSize: '0.9rem' }}>
                                            <FileText size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '600' }}>{bill.description}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{bill.category} • {formatDate(bill.date)}</p>
                                        </div>
                                        <p style={{ fontWeight: '700' }}>{formatCurrency(bill.amount)}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="info-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Settlements</h2>
                            <p style={{ fontWeight: '700', color: '#10b981' }}>{formatCurrency(totalSettlements)}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Settled by Insurance</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total processed payments</p>
                            </div>
                            <p style={{ fontWeight: '600' }}>{formatCurrency(totalSettlements)}</p>
                        </div>

                        {/* Admin Action for Payment */}
                        {user?.role === 'admin' && (
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                <button onClick={() => setShowPaymentModal(true)} className="btn btn-primary full-width">
                                    Update Payment / Settlement
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Add Bill Modal */}
            {showBillModal && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="info-card animate-in" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Add New Bill</h2>
                            <button onClick={() => setShowBillModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} color="#666" /></button>
                        </div>
                        <form onSubmit={handleAddBill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Description</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="e.g. Lab Tests, Consultation"
                                    value={billForm.description}
                                    onChange={e => setBillForm({ ...billForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Amount (₹)</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="0.00"
                                    value={billForm.amount}
                                    onChange={e => setBillForm({ ...billForm, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '8px' }}>Add Bill</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Payment Modal */}
            {showPaymentModal && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="info-card animate-in" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Update Payment</h2>
                            <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} color="#666" /></button>
                        </div>
                        <form onSubmit={handleUpdatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Add a payment amount received from the insurance provider. This will update the total settlement amount.
                            </p>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Payment Amount (₹)</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    placeholder="0.00"
                                    value={paymentAmount}
                                    onChange={e => setPaymentAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '8px' }}>Process Payment</button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ClaimDetails;
