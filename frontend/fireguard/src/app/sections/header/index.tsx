'use client';

import Link from 'next/link';
import { HeaderStyles } from './styles';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext'; // Import the useUser hook

const Header: React.FC = () => {
  const { userRole, setUserRole } = useUser(); // Get userRole and setUserRole from context
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
        setUserRole(null); // Clear user role on logout
        router.push('/login'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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