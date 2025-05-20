"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import NavBar from '../navigation-bar';
import Footer from '../footer'; 

const CommunityPage = ({ onNavigateBack }) => {
  const communityPosts = [
    {
      prompt: "What reminder do you wish you had the last time you hesitated?",
      entries: [
        {
          name: "Fiona Green",
          imageUrl: "/izzie.jpg",
          transcript: "I wish someone had reminded me that rejection isn&apos;t the end of the world. I almost didn&apos;t apply for my dream job because I was afraid of rejection. When I finally did, I actually got an interview and while I didn&apos;t get that specific position, the connections I made led to an even better opportunity a few months later. Just apply, just ask, just try - the worst they can say is no."
        },
        {
          name: "Lara Smith",
          imageUrl: "/girl1.png",
          transcript: "I wish I had reminded myself that I was prepared. I hesitated before a big presentation, doubting all my knowledge. Looking back, I knew the material inside and out, but I let that moment of doubt shake my confidence. Now I keep a list of my qualifications and preparations that I review before big moments."
        },
        {
          name: "Samantha Brooke",
          imageUrl: "/girl2.png",
          transcript: "That nobody is born knowing how to do this. Everyone who&apos;s good at anything started somewhere, and most likely they were terrible at first. I hesitated to start learning to code because I felt so overwhelmed, but once I started and gave myself permission to be a beginner, it got easier every day."
        },
        {
          name: "Jen Miller",
          imageUrl: "/girl3.png",
          transcript: "I wish I had remembered that everyone feels like an impostor sometimes. When I was put forward for a promotion, I almost turned it down because I thought I wasn&apos;t ready. My mentor reminded me that the perfect moment never comes - we grow into roles by taking them. I accepted the promotion and it pushed me to develop skills I never would have otherwise."
        },
        {
          name: "Tasha Williams",
          imageUrl: "/tasha.png",
          transcript: "That it&apos;s okay to ask questions. I spent weeks struggling with a programming concept because I was afraid asking for help would make me look incompetent. When I finally reached out to a colleague, they solved my problem in five minutes and said they had the exact same issue when they started. Nobody expects you to know everything!"
        }
      ]
    },
    {
      prompt: "Talk about a time you failed and kept going anyway.",
      entries: [
        {
          name: "Amelia Roberts",
          imageUrl: "/girl5.png",
          transcript: "I failed my certification exam the first time by just two points. It was devastating because I&apos;d studied for months. After allowing myself one day to feel bad about it, I signed up to take it again, identified my weak areas, and focused my studying. I passed with flying colors the second time, and the experience taught me more about resilience than any success ever could."
        },
        {
          name: "Ananya Gupta",
          imageUrl: "/girl7.png",
          transcript: "My first startup completely tanked after 18 months of pouring everything into it. We ran out of money, and had to let our small team go. It was heart-wrenching. But I took the lessons from that experience - mainly about cash flow management and market validation - and my second venture has been running successfully for three years now. That failure was my best business education."
        },
        {
          name: "Anabelle White",
          imageUrl: "/girl8.png",
          transcript: "I bombed an important client presentation so badly that my boss had to step in and salvage it. I was mortified and sure I&apos;d be fired. Instead of giving up, I asked for honest feedback, worked with a speaking coach, and practiced relentlessly. Six months later, I led our biggest client pitch of the year - and we won the account. Sometimes you need to fail publicly to find the motivation to truly improve."
        },
        {
          name: "Maya Johnson",
          imageUrl: "/girl9.png",
          transcript: "I applied for a prestigious fellowship three years in a row before I got it. The first rejection crushed me, the second one stung, but by the third year, I&apos;d learned so much from the feedback that my application was completely different. Those &apos;failures&apos; forced me to clarify my research goals and improve my writing in ways that success never would have."
        },
        {
          name: "Zoe Chen",
          imageUrl: "/girl6.png",
          transcript: "My entire product launch failed because I didn&apos;t do enough user testing. We had spent six months building something nobody actually wanted. Instead of abandoning the project, I went back to basics - conducted proper user interviews, identified the real pain points, and pivoted. The new version was a hit, and I never would have found that solution without the initial failure."
        }
      ]
    }
  ];

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [visibleIndices, setVisibleIndices] = useState([0, 0]);

  const handlePlayClick = (promptIndex, entryIndex) => {
    const actualEntryIndex = entryIndex + visibleIndices[promptIndex];
    setSelectedEntry({ promptIndex, entryIndex: actualEntryIndex });
    setShowTranscript(true);
  };

  const handleCloseTranscript = () => {
    setShowTranscript(false);
  };

  const navigateEntries = (promptIndex, direction) => {
    const newIndices = [...visibleIndices];
    const entriesPerView = 3;
    const maxIndex = Math.max(0, communityPosts[promptIndex].entries.length - entriesPerView);
    
    if (direction === 'left' && visibleIndices[promptIndex] > 0) {
      newIndices[promptIndex] = Math.max(0, visibleIndices[promptIndex] - 1);
    } else if (direction === 'right' && visibleIndices[promptIndex] < maxIndex) {
      newIndices[promptIndex] = Math.min(maxIndex, visibleIndices[promptIndex] + 1);
    }
    
    setVisibleIndices(newIndices);
  };

  const showLeftArrow = (promptIndex) => visibleIndices[promptIndex] > 0;
  const showRightArrow = (promptIndex) => {
    const entriesPerView = 3;
    const maxIndex = Math.max(0, communityPosts[promptIndex].entries.length - entriesPerView);
    return visibleIndices[promptIndex] < maxIndex;
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      
      <NavBar activePage="community" />

      <div className="container mx-auto px-6 py-8 flex-grow">
       
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">Community</h1>
          <button className="bg-yellow-100 border border-yellow-200 px-5 py-2 rounded-full font-medium cursor-pointer hover:bg-yellow-200 transition-colors">
            Give Advice
          </button>
        </div>

        
        <div className="space-y-12">
          {communityPosts.map((post, promptIndex) => (
            <div key={promptIndex} className="space-y-6">
             
              <div className="bg-purple-200 rounded-full px-6 py-3">
                <h2 className="text-xl font-medium">{post.prompt}</h2>
              </div>
              
              
              <div className="relative">
               
                {showLeftArrow(promptIndex) && (
                  <button 
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigateEntries(promptIndex, 'left')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                
              
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {post.entries
                    .slice(visibleIndices[promptIndex], visibleIndices[promptIndex] + 3)
                    .map((entry, entryIndex) => (
                      <div 
                        key={entryIndex} 
                        className="border border-gray-300 rounded-lg p-5 flex flex-col items-center transition-all duration-300"
                      >
                        <h3 className="font-medium mb-4">{entry.name}</h3>
                        
                       
                        <div className="w-28 h-28 rounded-full overflow-hidden mb-5 relative">
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
                          className="bg-purple-300 rounded-full p-2 mb-3 hover:bg-purple-400 transition-colors cursor-pointer"
                          onClick={() => handlePlayClick(promptIndex, entryIndex)}
                        >
                          <div className="w-10 h-10 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                            </svg>
                          </div>
                        </button>
                        
                        <span 
                          className="text-sm cursor-pointer hover:text-purple-600"
                          onClick={() => handlePlayClick(promptIndex, entryIndex)}
                        >
                          View Transcript
                        </span>
                      </div>
                    ))}
                </div>
                
               
                {showRightArrow(promptIndex) && (
                  <button 
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigateEntries(promptIndex, 'right')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
     
        <button 
          className="mt-12 text-gray-500 hover:text-gray-700 flex items-center cursor-pointer"
          onClick={onNavigateBack}
        >
          <span className="mr-1">←</span> Back to Home
        </button>
      </div>
      
      
      <Footer />
      

      {showTranscript && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {communityPosts[selectedEntry.promptIndex].entries[selectedEntry.entryIndex].name}
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={handleCloseTranscript}
              >
                ✕
              </button>
            </div>
            <p className="mb-2 text-sm text-gray-500">
              {communityPosts[selectedEntry.promptIndex].prompt}
            </p>
            <p className="mb-4">
              {communityPosts[selectedEntry.promptIndex].entries[selectedEntry.entryIndex].transcript}
            </p>
            <div className="flex justify-end">
              <button 
                className="bg-purple-300 px-4 py-2 rounded-full cursor-pointer hover:bg-purple-400 transition-colors"
                onClick={handleCloseTranscript}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;