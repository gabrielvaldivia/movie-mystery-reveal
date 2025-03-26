
import React, { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onTimeUpdate?: (elapsed: number) => void;
}

const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning,
  onTimeUpdate 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  
  // Reset timer when starting
  useEffect(() => {
    if (isRunning) {
      setTimeRemaining(duration);
    }
  }, [isRunning, duration]);
  
  useEffect(() => {
    let timerId: number | null = null;
    
    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => {
          const newRemaining = Math.max(0, prev - 100);
          const elapsed = duration - newRemaining;
          
          // Call update callback
          if (onTimeUpdate) {
            onTimeUpdate(elapsed);
          }
          
          if (newRemaining <= 0) {
            if (timerId) clearInterval(timerId);
            setTimeout(() => onTimeUp(), 0);
            return 0;
          }
          return newRemaining;
        });
      }, 100);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, onTimeUp, duration, onTimeUpdate]);
  
  const progress = Math.max(0, (timeRemaining / duration) * 100);
  
  return (
    <Progress 
      value={progress} 
      className="h-1 w-full rounded-none bg-transparent" 
      indicatorClassName="bg-white"
    />
  );
};

export default Timer;
