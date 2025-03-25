
import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isRunning }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  
  useEffect(() => {
    // Reset timer when isRunning changes to true
    if (isRunning) {
      setTimeRemaining(duration);
    }
  }, [isRunning, duration]);
  
  useEffect(() => {
    let timerId: number | null = null;
    
    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 100) {
            if (timerId) clearInterval(timerId);
            // Use a timeout to avoid state updates during rendering
            setTimeout(() => onTimeUp(), 0);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, onTimeUp]);
  
  const progress = Math.max(0, timeRemaining / duration);
  
  return (
    <div className="w-20 h-20 rounded-full bg-muted p-2 flex items-center justify-center relative animate-fade-in">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle 
          className="text-muted-foreground stroke-current" 
          strokeWidth="6"
          fill="transparent"
          r="40" 
          cx="50" 
          cy="50" 
        />
        <circle 
          className="text-primary stroke-current transition-all duration-100"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${Math.min(250, 2 * Math.PI * 40 * progress)} ${2 * Math.PI * 40}`}
          fill="transparent"
          r="40" 
          cx="50" 
          cy="50" 
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-medium">{Math.ceil(timeRemaining / 1000)}</span>
      </div>
    </div>
  );
};

export default Timer;
