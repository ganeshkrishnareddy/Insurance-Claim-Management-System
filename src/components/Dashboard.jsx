import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, User, ArrowRight, Search, Filter, SortAsc, Clock, Linkedin, Github, Globe, X, LogOut } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { useAuth } from '../context/AuthContext';
import { calculateTotal, formatCurrency, getStatusColor, formatTimeAgo } from '../utils';

const Dashboard = () => {
    const { claims } = useClaims();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
    const searchInputRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Auto-focus on mount
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Calculate counts
    const getCount = (status) => {
        if (status === 'all') return claims.length;
        return claims.filter(c => c.status === status).length;
    };

    const filteredClaims = claims
        .filter(c => {
            const searchWords = debouncedQuery.toLowerCase().trim().split(/\s+/);
            const fullName = c.patient.fullName.toLowerCase();
            const insuranceId = c.patient.insuranceId.toLowerCase();

            const matchesSearch = searchWords.every(word =>
                fullName.includes(word) || insuranceId.includes(word)
            );

            const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'amount') {
                return calculateTotal(b.bills) - calculateTotal(a.bills);
            }
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

    const statusOptions = ['all', 'draft', 'submitted', 'approved', 'rejected'];

    return (
        <div className="dashboard animate-in">
            <header className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1>Claims Dashboard</h1>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                        {user?.role.toUpperCase()}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {user?.role === 'user' && (
                        <Link to="/new" className="btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
                            <Plus size={18} /> New Claim
                        </Link>
                    )}
                    <button onClick={logout} className="btn" style={{ color: 'white', padding: '8px' }} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="dashboard-controls">
                <div className="search-bar-wrap">
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="filters-section">
                    <div className="filter-chips-scroll">
                        <div className="filter-chips">
                            {statusOptions.map(status => (
                                <button
                                    key={status}
                                    className={`chip ${status} ${filterStatus === status ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(status)}
                                    role="tab"
                                    aria-selected={filterStatus === status}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                    <span className="chip-count">({getCount(status)})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sort-wrapper">
                        <button className="sort-toggle" onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}>
                            <SortAsc size={18} /> {sortBy === 'date' ? 'Date' : 'Amount'}
                        </button>
                    </div>
                </div>
            </div>

            {filteredClaims.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon shadow-pulse">📑</div>
                    <p>No claims found match your criteria.</p>
                </div>
            ) : (
                <div className="claims-list">
                    {filteredClaims.map(claim => {
                        const total = calculateTotal(claim.bills);
                        return (
                            <Link key={claim.id} to={`/claim/${claim.id}`} className="claim-card-link">
                                <div className="claim-card">
                                    <div className="claim-icon" style={{ backgroundColor: getStatusColor(claim.status) }}>
                                        <User size={24} color="white" />
                                    </div>
                                    <div className="claim-info">
                                        <div className="name-row">
                                            <h3>{claim.patient.fullName}</h3>
                                            <span className="amount-bold">{formatCurrency(total)}</span>
                                        </div>
                                        <div className="id-row">
                                            <p className="sub-text">ID: {claim.patient.insuranceId}</p>
                                            <span className="updated-text"><Clock size={12} /> {formatTimeAgo(claim.updatedAt)}</span>
                                        </div>
                                        <div className="card-badges">
                                            <span className={`status-badge ${claim.status}`}>{claim.status}</span>
                                        </div>
                                    </div>
                                    <div className="claim-action">
                                        <ArrowRight size={20} color="#ccc" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
            <footer className="footer">
                <p className="credit">Developed by <br /><strong>P Ganesh Krishna Reddy</strong></p>
                <p className="contact-small">pganeshkrishnareddy@gmail.com | +91 8374622779</p>
                <div className="social-links-grid">
                    <a href="https://linkedin.com/in/pganeshkrishnareddy" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                        <Linkedin size={24} />
                    </a>
                    <a href="https://github.com/ganeshkrishnareddy" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                        <Github size={24} />
                    </a>
                    <a href="https://pganeshkrishnareddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="social-link" title="Portfolio">
                        <Globe size={24} />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
