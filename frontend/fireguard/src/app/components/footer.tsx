import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react"; // Social media icons

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4 shadow-md z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Copyright */}
          <p className="text-sm">&copy; {new Date().getFullYear()} FireGuardAI</p>

          {/* Navigation Links */}
          <nav className="flex space-x-4">
            <Link href="/privacy-policy" className="text-sm hover:text-gray-400">
              Privacy Policy
            </Link>
            <span className="text-gray-500">|</span>
            <Link href="/terms-of-service" className="text-sm hover:text-gray-400">
              Terms of Service
            </Link>
          </nav>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link href="https://facebook.com" aria-label="Facebook" target="_blank">
              <Facebook size={20} className="hover:text-gray-400" />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter" target="_blank">
              <Twitter size={20} className="hover:text-gray-400" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram" target="_blank">
              <Instagram size={20} className="hover:text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
