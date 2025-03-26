
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const updateTimeRef = useRef<((elapsed: number) => void) | undefined>(onTimeUpdate);
  
  // Update the ref when the callback changes
  useEffect(() => {
    updateTimeRef.current = onTimeUpdate;
  }, [onTimeUpdate]);
  
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
          const newRemaining = Math.max(0, prev - 100);
          const elapsed = duration - newRemaining;
          
          // Call update using the ref to avoid issues with stale callbacks
          if (updateTimeRef.current) {
            updateTimeRef.current(elapsed);
          }
          
          if (newRemaining <= 0) {
            if (timerId) clearInterval(timerId);
            // Use a timeout to avoid state updates during rendering
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
  }, [isRunning, timeRemaining, onTimeUp, duration]);
  
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
