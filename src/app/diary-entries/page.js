"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '../navigation-bar';
import Footer from '../footer';

const DiaryEntriesPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleDateIndex, setVisibleDateIndex] = useState(0);
  const [dates, setDates] = useState([
    { id: '0517', date: '05/17', day: 'Saturday', hasEntry: false },
    { id: '0518', date: '05/18', day: 'Sunday', hasEntry: false },
    { id: '0519', date: '05/19', day: 'Monday', hasEntry: false },
    { id: '0520', date: '05/20', day: 'Tuesday', hasEntry: false }
  ]);
  
  useEffect(() => {
    const storedRecordingUrl = localStorage.getItem('latestRecording');
    const recordingDate = localStorage.getItem('recordingDate');
    
    if (storedRecordingUrl && recordingDate) {
      const updatedDates = dates.map(date => {
        if (date.id === '0520') {
          return {
            ...date,
            hasEntry: true,
            prompt: "Tell me about a time when you took a risk, and it worked out",
            audioUrl: storedRecordingUrl
          };
        }
        return date;
      });
      
      setDates(updatedDates);
    }
    
    // Find and select the 05/20 date
    const may20 = dates.find(date => date.id === '0520');
    if (may20) {
      setSelectedDate(may20);
    }
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      const updatedSelectedDate = dates.find(date => date.id === selectedDate.id);
      if (updatedSelectedDate) {
        setSelectedDate(updatedSelectedDate);
      }
    }
  }, [dates]);
  
  const navigatePrevious = () => {
    if (visibleDateIndex > 0) {
      setVisibleDateIndex(visibleDateIndex - 1);
    }
  };
  
  const navigateNext = () => {
    if (visibleDateIndex < dates.length - 4) {
      setVisibleDateIndex(visibleDateIndex + 1);
    }
  };
  
  const hasPrevious = visibleDateIndex > 0;
  
  const hasNext = visibleDateIndex < dates.length - 4;

  const handleDownloadAudio = () => {
    if (selectedDate && selectedDate.hasEntry && selectedDate.audioUrl) {
      const a = document.createElement('a');
      a.href = selectedDate.audioUrl;
      a.download = `diary-entry-${selectedDate.date}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      
      <NavBar activePage="diary-entries" />

      <div className="container mx-auto px-6 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">Diary Entries</h1>
          <p className="text-gray-600">Click a date to view your past entry</p>
        </div>
        
       
        <div className="flex items-center justify-center mb-16">
          <button 
            className={`w-10 h-10 flex items-center justify-center mr-4 ${!hasPrevious ? 'text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={navigatePrevious}
            disabled={!hasPrevious}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex space-x-4">
            {dates.slice(visibleDateIndex, visibleDateIndex + 4).map((date) => (
              <button
                key={date.id}
                className={`w-24 h-32 rounded-lg flex flex-col items-center justify-center transition-all ${
                  selectedDate && selectedDate.id === date.id
                    ? 'bg-purple-400 text-white shadow-md scale-105'
                    : 'bg-purple-300 hover:bg-purple-400 hover:text-white'
                } ${date.hasEntry ? '' : 'opacity-70'}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xl font-bold">{date.date}</span>
                <span className="text-sm mt-1">{date.day}</span>
              </button>
            ))}
          </div>
          
          <button 
            className={`w-10 h-10 flex items-center justify-center ml-4 ${!hasNext ? 'text-gray-300' : 'text-gray-700 hover:text-gray-900'}`}
            onClick={navigateNext}
            disabled={!hasNext}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        
        {selectedDate && selectedDate.hasEntry ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedDate.day}, {selectedDate.date}/2025
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl mb-2 font-medium">Your Prompt:</h3>
              <p className="text-gray-700">{selectedDate.prompt}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl mb-4 font-medium">Your Response:</h3>
              
              <div className="mb-6">
                <audio 
                  controls 
                  className="w-full mb-4"
                  src={selectedDate.audioUrl}
                >
                  Your browser does not support the audio element.
                </audio>
                
               
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="bg-purple-300 px-6 py-2 rounded-full hover:bg-purple-400 transition-colors"
                  onClick={handleDownloadAudio}
                >
                  Download Audio
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {selectedDate ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">
                  {selectedDate.day}, {selectedDate.date}/2025
                </h2>
                <p className="mb-8">No entry recorded for this date.</p>
                
                
                {selectedDate.id === '0520' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-center">
                      <Link 
                        href="/diaryRecording" 
                        className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition-colors inline-block"
                      >
                        Record Today's Entry
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>Select a date to view your diary entry.</p>
            )}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/home" className="text-purple-600 hover:text-purple-800">
            ← Back to Home
          </Link>
        </div>
      </div>
      
      
      <Footer />
    </div>
  );
};

export default DiaryEntriesPage;