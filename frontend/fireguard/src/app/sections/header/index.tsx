'use client';

import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 shadow-md z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[#ffdbbb] text-xl font-bold hover:opacity-80">
            FireGuardAI
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-[#ffdbbb] hover:opacity-80 text-sm">
              Home
            </Link>
            <Link href="/about" className="text-[#ffdbbb] hover:opacity-80 text-sm">
              About
            </Link>
            <Link href="/contact" className="text-[#ffdbbb] hover:opacity-80 text-sm">
              Contact
            </Link>
            <Link href="/auth" className="text-[#ffdbbb] hover:opacity-80 text-sm">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;