import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (u, p) => {
        try {
            const result = await login(u, p);
            if (result.success) {
                navigate('/');
            } else {
                // Show the specific error from Firebase
                setError(result.message || 'Login failed.');
            }
        } catch (err) {
            setError('An unexpected error occurred: ' + err.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    return (
        <div className="login-container">
            <div className="login-card animate-in">
                <div className="login-header">
                    <div className="login-icon">
                        <Lock size={32} color="white" />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to manage claims</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary full-width">
                        Sign In <ArrowRight size={18} />
                    </button>

                    <div className="quick-login-buttons">
                        <p style={{ textAlign: 'center', margin: '15px 0 10px', color: '#666', fontSize: '0.9rem' }}>— Or Quick Login —</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => { setUsername('admin'); setPassword('admin'); }} className="btn btn-outline full-width">
                                👑 Admin
                            </button>
                            <button type="button" onClick={() => { setUsername('user'); setPassword('user'); }} className="btn btn-outline full-width">
                                👤 User
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <style>{`
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-gradient);
                    padding: 20px;
                }
                .login-card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    width: 100%;
                    max-width: 420px;
                    padding: 40px;
                    backdrop-filter: blur(10px);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .login-icon {
                    background: var(--bg-soft);
                    width: 72px;
                    height: 72px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    box-shadow: var(--shadow-sm);
                }
                .login-header h1 { 
                    margin: 0; 
                    font-size: 1.75rem; 
                    background: var(--bg-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 700;
                }
                .login-header p { color: var(--text-muted); margin: 8px 0 0; }
                .input-with-icon { position: relative; }
                .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .input-with-icon input { 
                    padding: 14px 14px 14px 48px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .input-with-icon input:focus {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
                    outline: none;
                }
                .error-message {
                    background: #fee2e2;
                    color: #ef4444;
                    padding: 12px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .quick-login-buttons .btn {
                    justify-content: center;
                    margin-top: 0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Login;
