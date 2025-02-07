"use client"; // Ensures this runs only on the client side

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white px-6 py-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          MyWebsite
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex space-x-6">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="sm:hidden bg-gray-800 mt-2 p-4 flex flex-col space-y-4">
          <Link href="/" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-gray-400" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
