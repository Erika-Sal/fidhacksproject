"use client"

import React, { useState } from 'react';
import SignupPage from './signup';

const EchoLandingPage = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  if (currentPage === 'signup') {
    return <SignupPage onNavigateBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-stone-50">
      
      <nav className="w-full flex justify-end py-4 px-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button 
            className="bg-purple-300 px-6 py-1 rounded-full font-medium"
            onClick={() => setCurrentPage('signup')}
          >
            Sign Up
          </button>
          <button className="border border-gray-500 px-6 py-1 rounded-full font-medium">
            Login
          </button>
        </div>
      </nav>

      
      <main className="flex flex-col max-w-2xl mx-auto px-6 py-12 flex-grow">
        
        <div className="text-5xl font-bold mb-10 mt-20">
          Empower yourself with 
          <span className="bg-purple-300 px-2 ml-2">your own</span>
          <div className="mt-2">
            <span className="bg-purple-300 px-2">memories</span>
          </div>
        </div>

        
        <p className="text-xl mb-12">
          NextHire helps break through self-doubt with personalized encouragement,
          <br />
          exactly when you need it most. Apply to jobs with confidence!
        </p>

        
        <div className="flex gap-6">
          <button 
            className="bg-purple-300 px-8 py-3 rounded-full text-xl font-medium"
            onClick={() => setCurrentPage('signup')}
          >
            Get Started
          </button>
          <button className="bg-yellow-100 border border-yellow-200 px-8 py-3 rounded-full text-xl font-medium">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
};

export default EchoLandingPage;
