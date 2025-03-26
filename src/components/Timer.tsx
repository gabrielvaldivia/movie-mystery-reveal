
import React, { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onTimeUpdate?: (elapsedTime: number) => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isRunning, onTimeUpdate }) => {
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
          const newTime = prev <= 100 ? 0 : prev - 100;
          
          // Calculate elapsed time and report it if callback exists
          if (onTimeUpdate) {
            const elapsedTime = duration - newTime;
            onTimeUpdate(elapsedTime);
          }
          
          if (newTime <= 0) {
            if (timerId) clearInterval(timerId);
            // Use a timeout to avoid state updates during rendering
            setTimeout(() => onTimeUp(), 0);
            return 0;
          }
          return newTime;
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
