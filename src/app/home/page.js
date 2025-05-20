"use client"

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '../navigation-bar';
import Footer from '../footer';

const HomePage = () => {
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const adviceEntries = [
    {
      name: "Shreya Rastogi",
      imageUrl: "/shreya.JPEG",
      audioUrl: "/shreyaSound.m4a", 
      transcript: "When I was starting out, I kept thinking I needed to know every programming language perfectly. But, tech roles need people who can learn and adapt new skills quickly. So, it is important to build a strong foundation with the basics, build some projects. And then, just apply! Don&apos;t let the fear of not knowing everything hold you back."
    },
    {
      name: "Lakshmi Prakash",
      imageUrl: "/lakshmi.JPG",
      transcript: "I almost didn&apos;t apply to my current role because the description seemed intimidating. Remember that job descriptions are wish lists, not exact requirements. Women often feel they need to be 100% qualified, while men apply at around 60%. Take that same confidence with you, and remember that diverse perspectives are valuable in tech."
    },
    {
      name: "Maegan McCarthy",
      imageUrl: "/maegan.png",
      transcript: "The tech interview process can feel designed to make you fail, but it is really about seeing how you think. Practice talking through problems out loud, even if you don&apos;t immediately know the answer. And remember to negotiate your offer! I didn&apos;t negotiate my first job and later learned my male peers did. Know your worth."
    }
  ];

  const handlePlayClick = (index) => {
    if (index === 0) {
     
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(error => {
            console.error("Error playing audio:", error);
          });
          setIsPlaying(true);
        }
      }
    } else {
      setSelectedTranscript(index);
      setShowTranscript(true);
    }
  };

  const handleCloseTranscript = () => {
    setShowTranscript(false);
    if (selectedTranscript === 0 && isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
    
      <audio 
        ref={audioRef}
        src="/shreyaSound.m4a" 
        onEnded={handleAudioEnded}
        onError={(e) => console.error("Audio error:", e)}
      />
      
     
      <NavBar activePage="home" />
      
     
      <div className="container mx-auto px-6 pt-16 pb-8 flex-grow">
       
        <h1 className="text-4xl font-bold mb-14 text-center">
          Welcome to the NextHire&apos;s Home Base!
        </h1>
       
        <div className="flex flex-col items-center mb-10">
          <Link 
            href="/diary-recordings" 
            className="bg-purple-300 px-12 py-5 rounded-full text-2xl font-medium mb-4"
          >
            Complete Today&apos;s Diary Entry
          </Link>
        
          <div className="h-1 bg-purple-300 w-64 md:w-96 rounded-full mt-3"></div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-medium text-center mb-2">
            Advice of the Day:
          </h2>
          <h3 className="text-2xl text-center mb-10">
            Share Advice for Women Hesitating to Apply for Tech Roles
          </h3>
          
         
          <div className="flex flex-wrap justify-center gap-10">
            {adviceEntries.map((entry, index) => (
              <div 
                key={index} 
                className="border border-gray-300 rounded-lg p-6 w-72 flex flex-col items-center"
              >
                <h4 className="font-medium mb-5">{entry.name}</h4>
                
               
                <div className="w-28 h-28 rounded-full overflow-hidden mb-6 relative">
                  {entry.imageUrl ? (
                    <Image 
                      src={entry.imageUrl} 
                      alt={`Photo of ${entry.name}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300"></div>
                  )}
                </div>
                
              
                <button 
                  className="bg-purple-300 rounded-full p-2 mb-4 cursor-pointer hover:bg-purple-400 transition-colors"
                  onClick={() => handlePlayClick(index)}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                    </svg>
                  </div>
                </button>
                
                <span className="text-sm cursor-pointer" onClick={() => handlePlayClick(index)}>
                  View Transcript
                </span>
              </div>
            ))}
          </div>
          
        
          <div className="flex justify-center mt-8 mb-12">
            <Link
              href="/community" 
              className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-100 transition-colors"
            >
              View More
            </Link>
          </div>
        </div>
        
      
        {showTranscript && selectedTranscript !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{adviceEntries[selectedTranscript].name}</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseTranscript}
                >
                  ✕
                </button>
              </div>
              <p className="mb-4">{adviceEntries[selectedTranscript].transcript}</p>
              <div className="flex justify-between">
                <button 
                  className="bg-purple-300 px-4 py-2 rounded-full flex items-center cursor-pointer"
                  onClick={() => {
                  
                    if (selectedTranscript === 0) {
                      if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        audioRef.current.play();
                        setIsPlaying(true);
                      }
                    }
                  }}
                  style={{ visibility: selectedTranscript === 0 ? 'visible' : 'hidden' }}
                >
                  {isPlaying ? "Pause Audio" : "Play Audio"}
                </button>
                <button 
                  className="bg-purple-300 px-4 py-2 rounded-full cursor-pointer"
                  onClick={handleCloseTranscript}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
   
      <Footer />
    </div>
  );
};

export default HomePage;