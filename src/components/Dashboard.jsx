import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, Bell, User, Clock,
    CheckCircle, XCircle, FileText,
    Sun, Moon
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { calculateTotal, formatCurrency, getStatusColor } from '../utils';
import Footer from './Footer';

const Dashboard = () => {
    const { claims } = useClaims();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Calculate counts for stats
    const stats = {
        total: claims.length,
        approved: claims.filter(c => c.status === 'approved').length,
        rejected: claims.filter(c => c.status === 'rejected').length,
        pending: claims.filter(c => c.status === 'submitted').length
    };

    const recentClaims = [...claims]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="dashboard animate-in">
            <header className="header">
                <h1>Dashboard</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button className="btn-text glass" style={{ padding: '10px', borderRadius: '12px', background: 'var(--card-bg)' }}>
                        <Bell size={20} color="#1A1A1A" />
                    </button>
                    <button onClick={logout} className="btn-text glass" style={{ padding: '10px', borderRadius: '12px', background: 'var(--card-bg)' }}>
                        <User size={20} color="#1A1A1A" />
                    </button>
                </div>
            </header>

            <section className="hero-section">
                <h1>Welcome back, {user?.role === 'admin' ? 'Admin' : 'User'}</h1>
                <p>Here's what's happening with your claims today</p>
            </section>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Claims</span>
                        <div className="stat-icon-wrap" style={{ background: '#eff6ff' }}>
                            <FileText size={20} color="#3b82f6" />
                        </div>
                    </div>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Approved</span>
                        <div className="stat-icon-wrap" style={{ background: '#dcfce7' }}>
                            <CheckCircle size={20} color="#10b981" />
                        </div>
                    </div>
                    <span className="stat-value">{stats.approved}</span>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Rejected</span>
                        <div className="stat-icon-wrap" style={{ background: '#fee2e2' }}>
                            <XCircle size={20} color="#ef4444" />
                        </div>
                    </div>
                    <span className="stat-value">{stats.rejected}</span>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Pending</span>
                        <div className="stat-icon-wrap" style={{ background: '#fef3c7' }}>
                            <Clock size={20} color="#f59e0b" />
                        </div>
                    </div>
                    <span className="stat-value">{stats.pending}</span>
                </div>
            </div>

            <main className="claims-container">
                <div className="main-card">
                    <div className="card-header">
                        <h2>Recent Claims</h2>
                        <Link to="/all-claims" className="btn-view-all">View All →</Link>
                    </div>
                    <div className="claims-list-new">
                        {recentClaims.map(claim => {
                            const total = calculateTotal(claim.bills);
                            const initials = getInitials(claim.patient.fullName);
                            return (
                                <Link key={claim.id} to={`/claim/${claim.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="claim-row">
                                        <div className="claim-avatar">
                                            {initials}
                                        </div>
                                        <div className="claim-meta">
                                            <h3>{claim.patient.fullName}</h3>
                                            <p>{claim.patient.insuranceId}</p>
                                        </div>
                                        <div className="claim-amount-wrap">
                                            <span className="claim-amount">{formatCurrency(total)}</span>
                                            <span className={`badge ${claim.status.toLowerCase().replace(' ', '-')}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Link to="/new" className="fab">
                <Plus size={32} />
            </Link>

            <Footer />
        </div>
    );
};

export default Dashboard;
