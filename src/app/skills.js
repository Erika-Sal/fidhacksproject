"use client"

import React, { useState, useEffect, useRef } from 'react';
import HomePage from './home/page'; 

const SkillsSearchPage = ({ onNavigateBack, onContinue }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [currentStep, setCurrentStep] = useState(3); 
  const searchRef = useRef(null);

  const mockSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "C++", "C#", 
    "TypeScript", "HTML", "CSS", "SQL", "MongoDB", "AWS", "Azure", 
    "Docker", "Kubernetes", "Git", "DevOps", "Machine Learning", 
    "Data Analysis", "UI/UX Design", "Product Management", 
    "Agile Methodology", "Scrum", "Leadership", "Communication",
    "Problem Solving", "Critical Thinking", "Teamwork"
  ];

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = mockSkills.filter(
        skill => skill.toLowerCase().includes(searchTerm.toLowerCase()) && 
                !selectedSkills.includes(skill)
      );
      setSuggestions(filtered.slice(0, 5)); 
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, selectedSkills]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      } else {
        addSkill(searchTerm.trim());
      }
    }
  };

  const renderContent = () => {
    if (currentStep === 4) {
      return (
        <HomePage 
          userData={{ skills: selectedSkills }}
          onNavigateBack={() => setCurrentStep(3)}
        />
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-stone-50">
      
        
        
       
        <div className="w-full h-px bg-gray-200 shadow-sm"></div>
        
       
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <div className="w-full max-w-md">
            
            <h1 className="text-4xl font-bold text-center mb-12">
              Any Additional Skills??
            </h1>
            
           
            <div className="relative mb-8" ref={searchRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              />
              
              
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.map((skill, index) => (
                    <div 
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          
            {selectedSkills.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-medium mb-2">Selected Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill, index) => (
                    <div 
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{skill}</span>
                      <button 
                        className="ml-2 text-purple-600 font-bold"
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
           
            <div className="flex justify-end">
              <button 
                className="bg-purple-300 px-8 py-3 rounded-full text-xl font-medium"
                onClick={() => setCurrentStep(4)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return renderContent();
};

export default SkillsSearchPage;
