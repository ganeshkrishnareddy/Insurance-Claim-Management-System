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
                    background: #f3f4f6;
                    padding: 20px;
                }
                .login-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    width: 100%;
                    max-width: 400px;
                    padding: 30px;
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .login-icon {
                    background: var(--primary);
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                }
                .login-header h1 { margin: 0; font-size: 1.5rem; }
                .login-header p { color: #666; margin: 5px 0 0; }
                .input-with-icon { position: relative; }
                .input-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }
                .input-with-icon input { padding-left: 38px; }
                .error-message {
                    background: #fee2e2;
                    color: #ef4444;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                    text-align: center;
                }
                .login-help {
                    text-align: center;
                    margin-top: 20px;
                    color: #6b7280;
                    font-size: 0.85rem;
                    background: #f9fafb;
                    padding: 10px;
                    border-radius: 8px;
                }
                .quick-login-buttons .btn {
                    justify-content: center;
                    margin-top: 0;
                }
            `}</style>
        </div>
    );
};

export default Login;
