import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-new" style={{ marginTop: 'auto' }}>
            <p className="footer-dev">Developed by <strong>P Ganesh Krishna Reddy</strong></p>
            <p className="footer-info" style={{ marginBottom: '16px' }}>Hospital Claims Management System</p>

            <div className="social-btns">
                <a href="https://www.linkedin.com/in/pganeshkrishnareddy" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn">
                    <Linkedin size={20} color="#16a34a" />
                </a>
                <a href="https://github.com/ganeshkrishnareddy" target="_blank" rel="noopener noreferrer" className="social-btn" title="GitHub">
                    <Github size={20} color="#16a34a" />
                </a>
                <a href="mailto:pganeshkrishnareddy@gmail.com" className="social-btn" title="Email">
                    <Mail size={20} color="#16a34a" />
                </a>
                <a href="https://pganeshkrishnareddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="social-btn" title="Portfolio">
                    <Globe size={20} color="#16a34a" />
                </a>
            </div>

            <div className="footer-info">
                <p>+91-8374622779 | pganeshkrishnareddy@gmail.com</p>
                <p style={{ marginTop: '12px' }}>
                    <a
                        href="https://github.com/ganeshkrishnareddy/Insurance-Claim-Management-System"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
                    >
                        📱 View Flutter Version →
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
