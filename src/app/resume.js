"use client"

import React, { useState, useRef } from 'react';
import SkillsSearchPage from './skills';

const ResumeUploadPage = ({ onNavigateBack, onContinue }) => {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(e.dataTransfer.files[0]);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  if (currentStep === 3) {
    return (
      <SkillsSearchPage
        onNavigateBack={() => setCurrentStep(2)}
        onContinue={(skills) => {
          alert(`Skills selected: ${skills.join(', ')}\nThis would proceed to the next step.`);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
    
       
       
      <div className="w-full h-1 bg-blue-500"></div>
      
      
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md">
         
          <h1 className="text-4xl font-bold text-center mb-10">
            Please Upload your Resume
          </h1>
          
         
          <div 
            className={`border-2 border-gray-300 rounded-lg p-16 mb-10 text-center cursor-pointer flex flex-col items-center justify-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
            />
            
            <span className="text-2xl text-gray-400">
              {fileName ? fileName : 'Upload Here'}
            </span>
            
            {!fileName && (
              <p className="text-sm text-gray-400 mt-2">
                Drag and drop or click to select a file
              </p>
            )}
          </div>
          
         
          <div className="flex justify-end">
            <button 
              className={`bg-purple-300 px-8 py-3 rounded-full text-xl font-medium ${!fileName && 'opacity-70'}`}
              onClick={() => fileName && setCurrentStep(3)}
              disabled={!fileName}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
