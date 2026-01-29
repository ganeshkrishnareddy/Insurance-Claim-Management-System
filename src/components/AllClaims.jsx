import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { calculateTotal, formatCurrency, formatDate } from '../utils';
import Footer from './Footer';

const AllClaims = () => {
    const { claims } = useClaims();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const searchInputRef = useRef(null);

    const statusOptions = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected', 'Partially Settled'];

    const filteredClaims = claims.filter(c => {
        const matchesSearch = c.patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.patient.insuranceId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || c.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="dashboard animate-in">
            <header className="header" style={{ background: 'white', color: 'var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate('/')} className="btn-text glass" style={{ padding: '8px', borderRadius: '8px' }}>
                        <ArrowLeft size={24} color="var(--primary)" />
                    </button>
                    <h1 style={{ color: 'var(--primary)', margin: 0 }}>All Claims</h1>
                </div>
                <button className="btn-text glass" style={{ padding: '10px', borderRadius: '12px' }}>
                    <RotateCcw size={20} color="var(--primary)" />
                </button>
            </header>

            <main style={{ padding: '40px' }}>
                <div className="main-card">
                    <div className="card-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
                        <div className="search-bar" style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <Search size={20} color="#94a3b8" style={{ marginRight: '12px' }} />
                            <input
                                type="text"
                                placeholder="Search by patient name or claim ID..."
                                style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem', outline: 'none' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-chips" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {statusOptions.map(status => (
                                <button
                                    key={status}
                                    className={`chip ${filterStatus === status ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(status)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        background: filterStatus === status ? 'var(--primary)' : 'white',
                                        color: filterStatus === status ? 'white' : '#64748b',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '24px 32px' }}>
                        <p style={{ fontWeight: '600', color: '#64748b', marginBottom: '20px' }}>{filteredClaims.length} Claims Found</p>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="claims-table" style={{ minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--primary)', color: 'white', textAlign: 'left' }}>
                                        <th style={{ padding: '16px 20px', borderRadius: '8px 0 0 8px' }}>CLAIM ID</th>
                                        <th style={{ padding: '16px 20px' }}>PATIENT NAME</th>
                                        <th style={{ padding: '16px 20px' }}>CLAIM AMOUNT</th>
                                        <th style={{ padding: '16px 20px' }}>STATUS</th>
                                        <th style={{ padding: '16px 20px' }}>LAST UPDATED</th>
                                        <th style={{ padding: '16px 20px', borderRadius: '0 8px 8px 0' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClaims.map(claim => {
                                        const total = calculateTotal(claim.bills);
                                        return (
                                            <tr key={claim.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '20px', fontWeight: 'bold' }}>{claim.patient.insuranceId}</td>
                                                <td style={{ padding: '20px' }}>{claim.patient.fullName}</td>
                                                <td style={{ padding: '20px', fontWeight: 'bold' }}>{formatCurrency(total)}</td>
                                                <td style={{ padding: '20px' }}>
                                                    <span className={`badge ${claim.status.toLowerCase().replace(' ', '-')}`}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px' }}>{formatDate(claim.updatedAt)}</td>
                                                <td style={{ padding: '20px' }}>
                                                    <Link to={`/claim/${claim.id}`} className="btn-view-all" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        View <ArrowRight size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AllClaims;
