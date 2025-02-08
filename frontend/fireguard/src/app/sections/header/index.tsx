'use client';

import Link from 'next/link';
import { HeaderStyles } from './styles';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUserRole(null);
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const roleResponse = await fetch("http://127.0.0.1:8000/user/role", {
          method: "GET",
        });

        if (roleResponse.ok) {
          const { role } = await roleResponse.json();
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch {
        setUserRole(null);
      }
    };

    checkUserRole();
  }, []);

  return (
    <header className={`${HeaderStyles.container} ${HeaderStyles.font}`}>
      <div className={HeaderStyles.wrapper}>
        <div className={HeaderStyles.nav}>
          <Link href="/" className={HeaderStyles.logo}>
            Notifire
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
            {userRole ? (
              <>
                <Link href="/profile" className={HeaderStyles.link}>
                  Profile
                </Link>
                <button onClick={handleLogout} className={HeaderStyles.link}>
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className={HeaderStyles.link}>
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;