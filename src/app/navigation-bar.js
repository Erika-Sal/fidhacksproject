// src/app/components/NavBar.jsx
'use client';

import React from 'react';
import Link from 'next/link';

const NavBar = ({ activePage }) => {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between">
        {/* Logo */}
        <Link href="/home" className="text-2xl font-bold text-purple-600">
          NextHire
        </Link>
        
        {/* Navigation Links */}
        <div className="flex space-x-8">
         
          <Link 
            href="/diary-entries" 
            className={`transition-colors ${activePage === 'diary' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Diary Entries
          </Link>
          <Link 
            href="/community" 
            className={`transition-colors ${activePage === 'community' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Community
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;