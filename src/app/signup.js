"use client"

import React, { useState } from 'react';
import ResumeUploadPage from './resume';

const SignupPage = ({ onNavigateBack }) => {
  const [name, setName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  if (currentStep === 2) {
    return (
      <ResumeUploadPage
        onNavigateBack={() => setCurrentStep(1)}
        onContinue={() => {
          alert('Resume uploaded successfully! This would proceed to the next step.');
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      
      <div className="p-5 text-gray-400">
        NextHire
      </div>
      
      
      <div className="w-full h-px bg-gray-200 shadow-sm"></div>
      
     
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md">
          
          <h1 className="text-5xl font-bold text-center mb-16">
            Welcome to NextHire!
          </h1>
          
         
          <div className="mb-16">
            <h2 className="text-3xl mb-6 text-center">
              What is your first and last name?
            </h2>
            
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Here"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            />
          </div>
          
         
          <div className="flex justify-end">
            <button 
              className={`bg-purple-300 px-8 py-3 rounded-full text-xl font-medium ${!name.trim() && 'opacity-70'}`}
              onClick={() => name.trim() && setCurrentStep(2)}
              disabled={!name.trim()}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;