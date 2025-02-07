import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <Link href="/">
                    <a style={styles.link}>Home</a>
                </Link>
                <Link href="/about">
                    <a style={styles.link}>About</a>
                </Link>
                <Link href="/contact">
                    <a style={styles.link}>Contact</a>
                </Link>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

export default Header;