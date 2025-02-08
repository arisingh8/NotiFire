import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react"; // Social media icons

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4 shadow-md z-50">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} FireGuardAI. All rights reserved.</p>
        
        {/* Navigation Links */}
        <nav className="mt-2 space-x-4">
          <Link href="/privacy-policy" className="hover:text-gray-400">
            Privacy Policy
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="/terms-of-service" className="hover:text-gray-400">
            Terms of Service
          </Link>
        </nav>

        {/* Social Media Icons */}
        <div className="mt-3 flex justify-right space-x-4">
          <Link href="https://facebook.com" aria-label="Facebook" target="_blank">
            <Facebook size={24} className="hover:text-gray-400" />
          </Link>
          <Link href="https://twitter.com" aria-label="Twitter" target="_blank">
            <Twitter size={24} className="hover:text-gray-400" />
          </Link>
          <Link href="https://instagram.com" aria-label="Instagram" target="_blank">
            <Instagram size={24} className="hover:text-gray-400" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
