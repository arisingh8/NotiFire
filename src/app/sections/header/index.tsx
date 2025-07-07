import Link from 'next/link';
import { HeaderStyles } from './styles';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/getUser';
import { cookies } from 'next/headers';

const Header: React.FC = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const user = await getUser(supabase);

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
            </Link>{user ? (
              <><Link href="/dashboard" className={HeaderStyles.link}>
                Dashboard
              </Link>

                <Link href="/profile" className={HeaderStyles.link}>
                  Profile
                </Link>
                
                <form action="/auth/logout" method="post">
                  <button type="submit" className={HeaderStyles.link}>
                    Log Out
                  </button>
                </form>
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