'use client';

import Link from 'next/link';
import { HeaderStyles } from './styles';

const Header: React.FC = () => {
  return (
    <header className={`${HeaderStyles.container} ${HeaderStyles.font}`}>
      <div className={HeaderStyles.wrapper}>
        <div className={HeaderStyles.nav}>
          <Link href="/" className={HeaderStyles.logo}>
            FireGuardAI
          </Link>

          <div className={HeaderStyles.links}>
            <Link href="/" className={HeaderStyles.link}>
              Home
            </Link>
            <Link href="/about" className={HeaderStyles.link}>
              About
            </Link>
            <Link href="/contact" className={HeaderStyles.link}>
              Contact
            </Link>
            <Link href="/auth" className={HeaderStyles.link}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;