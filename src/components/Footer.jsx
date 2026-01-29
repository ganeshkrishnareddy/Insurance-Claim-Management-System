import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer-new" style={{ marginTop: 'auto' }}>
            <p className="footer-dev">Developed by <strong>Jai Krishna</strong></p>
            <p className="footer-info" style={{ marginBottom: '20px' }}>Hospital Claims Management System</p>

            <div className="social-btns">
                <a href="#" className="social-btn" title="LinkedIn"><Linkedin size={20} /></a>
                <a href="#" className="social-btn" title="GitHub"><Github size={20} /></a>
                <a href="mailto:jaikrishna9437@gmail.com" className="social-btn" title="Email"><Mail size={20} /></a>
            </div>

            <div className="footer-info">
                <p>+91 7681015433 | jaikrishna9437@gmail.com</p>
                <p style={{ marginTop: '8px' }}>© 2026 Jai Krishna. Built with ❤️ using React</p>
            </div>
        </footer>
    );
};

export default Footer;
