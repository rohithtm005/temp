import React, { useState, useEffect } from 'react';

const TYPING_SPEED = 80; // Reduced from 150
const SUBTITLE_DELAY = 300; // Reduced from 500

const Home: React.FC = () => {
  const [typedName, setTypedName] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  const fullName = "Hi, Myself Rohith";
  const fullSubtitle = "Analog Layout Engineer at C2i semiconductors";

  useEffect(() => {
    if (typedName.length < fullName.length) {
      const timeoutId = setTimeout(() => {
        setTypedName(fullName.slice(0, typedName.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeoutId);
    } else {
      // After name is typed, wait a bit then show subtitle
      const subtitleTimeout = setTimeout(() => {
        setShowSubtitle(true);
      }, SUBTITLE_DELAY);
      return () => clearTimeout(subtitleTimeout);
    }
  }, [typedName, fullName]);
  
  useEffect(() => {
    if (showSubtitle && typedSubtitle.length < fullSubtitle.length) {
      const timeoutId = setTimeout(() => {
        setTypedSubtitle(fullSubtitle.slice(0, typedSubtitle.length + 1));
      }, TYPING_SPEED / 2); // Type subtitle faster
      return () => clearTimeout(timeoutId);
    }
  }, [showSubtitle, typedSubtitle, fullSubtitle]);


  const nameComplete = typedName.length === fullName.length;
  const subtitleComplete = typedSubtitle.length === fullSubtitle.length;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="p-4 sm:p-8 bg-black/60 rounded-lg shadow-2xl border border-slate-700 w-full max-w-3xl">
        <div className="font-mono text-lg sm:text-2xl text-slate-100">
          <span className="text-green-400">{'>'} </span>
          <span>{typedName}</span>
          {!nameComplete && <span className="animate-pulse">_</span>}
        </div>
        
        {showSubtitle && (
          <div className="font-mono text-base sm:text-xl text-slate-300 mt-4">
             <span className="text-green-400">{'>'} </span>
            <span>{typedSubtitle}</span>
            {nameComplete && !subtitleComplete && <span className="animate-pulse">_</span>}
            {subtitleComplete && <span className="animate-pulse">_</span>}
          </div>
        )}

        {subtitleComplete && (
            <div className="mt-8">
                <a 
                    href="/resume.pdf" 
                    download="Rohith_TM_Resume.pdf"
                    className="inline-flex items-center px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-200 rounded-md font-mono"
                    aria-label="Download Rohith's Resume"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Resume
                </a>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;