import React, { useEffect, useState } from 'react';
import Logo from '../assets/logo.png';

const PageTransitionLoader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const interval = 10;
    const steps = duration / interval;
    const step = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 100); 
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-10 w-80 flex flex-col items-center shadow-md border border-gray-200">
        <img src={Logo} alt="Logo" className="w-20 h-20 mb-6 animate-pulse" />
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransitionLoader;