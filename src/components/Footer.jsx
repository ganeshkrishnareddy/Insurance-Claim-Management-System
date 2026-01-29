import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-new" style={{ marginTop: 'auto' }}>
            <p className="footer-title">Hospital Claims Management System</p>

            <p className="footer-dev">
                Designed & Developed by<br />
                <strong>P. Ganesh Krishna Reddy</strong>
            </p>

            <div className="social-btns">
                <a href="https://www.linkedin.com/in/pganeshkrishnareddy" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn">
                    <Linkedin size={18} style={{ color: 'black', stroke: 'black' }} />
                </a>
                <a href="https://github.com/ganeshkrishnareddy" target="_blank" rel="noopener noreferrer" className="social-btn" title="GitHub">
                    <Github size={18} style={{ color: 'black', stroke: 'black' }} />
                </a>
                <a href="mailto:pganeshkrishnareddy@gmail.com" className="social-btn" title="Email">
                    <Mail size={18} style={{ color: 'black', stroke: 'black' }} />
                </a>
                <a href="https://pganeshkrishnareddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="social-btn" title="Portfolio">
                    <Globe size={18} style={{ color: 'black', stroke: 'black' }} />
                </a>
            </div>

            <div className="footer-meta">
                <p>© 2026 All Rights Reserved</p>
                <p style={{ marginTop: '4px' }}>
                    <a
                        href="https://github.com/ganeshkrishnareddy/Insurance-Claim-Management-System"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flutter-link"
                    >
                        📱 View Flutter Version
                    </a>
                </p>
                <p className="version-text">Version 1.0.0 | Secure • Scalable • Reliable</p>
            </div>
        </footer>
    );
};

export default Footer;
