import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                <nav>
                    <a href="/privacy-policy" style={linkStyle}>Privacy Policy</a> | 
                    <a href="/terms-of-service" style={linkStyle}>Terms of Service</a>
                </nav>
            </div>
        </footer>
    );
};

const footerStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '1rem 0',
    textAlign: 'center',
};

const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
};

const linkStyle: React.CSSProperties = {
    color: '#fff',
    marginLeft: '0.5rem',
    textDecoration: 'none',
};

export default Footer;