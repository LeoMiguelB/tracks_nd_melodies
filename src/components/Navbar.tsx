'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">MiguelBBeats</div>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <Menu size={24} />
          </button>
        </div>
        <ul className={`lg:flex lg:space-x-4 lg:gap-8 ${isMenuOpen ? 'block' : 'hidden'} absolute lg:relative top-16 lg:top-0 left-0 lg:left-auto w-full lg:w-auto bg-black lg:bg-transparent p-4 lg:p-0`}>
          <li>
              <Link onClick={() => setIsMenuOpen(false)} href="/" className="block py-2 hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link onClick={() => setIsMenuOpen(false)} href="/signup" className="block py-2 hover:text-gray-300">Signup</Link>
          </li>
          <li>
            <Link onClick={() => setIsMenuOpen(false)} href="/about" className="block py-2 hover:text-gray-300">About</Link>
          </li>
        </ul>
      </div>
      <div className="w-full h-px bg-white mt-4"></div>
    </nav>
  );
};

export default Navbar;