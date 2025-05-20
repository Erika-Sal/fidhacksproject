"use client"

import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../navigation-bar';
import Footer from '../footer'; 
import { useRouter } from 'next/navigation';

const DiaryEntryPage = ({ onNavigateBack }) => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          setRecordingComplete(true);
        };

      } catch (err) {
        console.error("Error accessing microphone:", err);
        setPermissionDenied(true);
      }
    };

    checkMicrophonePermission();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'recording') {
      audioChunksRef.current = [];
      setAudioURL(null);
      setRecordingComplete(false);
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleRedoClick = () => {
    setRecordingComplete(false);
    setAudioURL(null);
  };

  const handleSubmitClick = () => {
    if (audioURL) {
      localStorage.setItem('latestRecording', audioURL);
      localStorage.setItem('recordingDate', new Date().toISOString());
      
      alert("Entry successfully saved!");
      
      if (router) {
        router.push('/diary-entries');
      } else if (onNavigateBack) {
        onNavigateBack();
      }
    }
  };

  const renderContent = () => {
    return (
      <div className="flex flex-col min-h-screen bg-stone-50">
       
        <NavBar activePage="diary-recordings" />

       
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl border border-gray-800 rounded-lg p-10 flex flex-col items-center">
            
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
              Today's Prompt
            </h1>
            
            
            <p className="text-xl text-center mb-12 max-w-md">
              Tell me about a time when you took a risk, and it worked out
            </p>
            
            {permissionDenied ? (
              <div className="text-red-500 text-center mb-8">
                Microphone access was denied. Please enable microphone access in your browser settings to record your entry.
              </div>
            ) : (
              <>
                
                <div className="mb-12 flex flex-col items-center">
                 
                  <button 
                    className={`w-24 h-24 rounded-full ${isRecording ? 'bg-red-400' : 'bg-purple-300'} 
                      flex items-center justify-center mb-8 focus:outline-none transition-colors`}
                    onClick={handleRecordButtonClick}
                    disabled={recordingComplete}
                  >
                    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.66 15 15 13.66 15 12V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V12C9 13.66 10.34 15 12 15Z" fill="black"/>
                      <path d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12H5C5 15.53 7.61 18.43 11 18.93V22H13V18.93C16.39 18.43 19 15.53 19 12H17Z" fill="black"/>
                    </svg>
                  </button>
                  
                  
                  <p className="text-center">
                    {isRecording 
                      ? "Recording... Click to stop" 
                      : recordingComplete 
                        ? "Recording complete"
                        : "Press the button to record and click to stop"
                    }
                  </p>
                </div>
                
                
                {recordingComplete && audioURL && (
                  <div className="mb-8 w-full max-w-md">
                    <p className="text-center mb-2 font-medium">Listen to your recording:</p>
                    <audio 
                      ref={audioPlayerRef}
                      src={audioURL} 
                      controls 
                      className="w-full"
                    />
                  </div>
                )}
                
               
                {recordingComplete && (
                  <div className="flex gap-4">
                    <button 
                      className="bg-purple-300 px-8 py-3 rounded-full text-xl font-medium"
                      onClick={handleSubmitClick}
                    >
                      Save Entry
                    </button>
                    <button 
                      className="border-2 border-purple-300 px-8 py-3 rounded-full text-xl font-medium"
                      onClick={handleRedoClick}
                    >
                      Redo
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          
          <button 
            className="mt-8 text-gray-500 hover:text-gray-700 flex items-center"
            onClick={onNavigateBack}
          >
            <span className="mr-1">←</span> Back to Home
          </button>
        </div>
        
        
        <Footer />
      </div>
    );
  };

  return renderContent();
};

export default DiaryEntryPage;