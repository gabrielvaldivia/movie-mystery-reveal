
import React, { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { cn } from "@/lib/utils";

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
