'use client';

import Link from 'next/link';
import { HeaderStyles } from './styles';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext'; // Import the useUser hook
import { createClient } from '@/utils/supabase/client';

const Header: React.FC = () => {
  const { userRole, setUserRole } = useUser(); // Get userRole and setUserRole from context
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }

      setUserRole(null); // Clear user role on logout
      router.push('/login'); // Redirect to login page

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
            </Link>{userRole ? (
              <>{(() => {
                  switch (userRole) {
                    case "resident":
                      return <Link href="/resident/dashboard" className={HeaderStyles.link}>Dashboard</Link>;
                    case "dispatcher":
                      return <Link href="/dispatcher/dashboard" className={HeaderStyles.link}>Dashboard</Link>;
                    case "first_responder":
                      return <Link href="/firstresponder/dashboard" className={HeaderStyles.link}>Dashboard</Link>;
                    default:
                      return <Link href="/" className={HeaderStyles.link}>Dashboard</Link>;
                  }
                })()}

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
            <Link href="/about" className={HeaderStyles.link}>
              About
            </Link>
            <Link href="/contact" className={HeaderStyles.link}>
              Contact
            </Link>
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;