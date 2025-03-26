
import React, { useState, useEffect, useRef } from 'react';
import { Progress } from './ui/progress';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isRunning }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const timerRef = useRef<number | null>(null);
  const previousRunningState = useRef(isRunning);
  
  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);
  
  useEffect(() => {
    // Clear any existing interval when component unmounts or when isRunning changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    // Only setup or clear the timer when isRunning changes
    if (isRunning && !previousRunningState.current) {
      // Starting the timer
      if (timeRemaining > 0) {
        timerRef.current = window.setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 100) {
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = null;
              // Use a timeout to avoid state updates during rendering
              setTimeout(() => onTimeUp(), 0);
              return 0;
            }
            return prev - 100;
          });
        }, 100);
      }
    } else if (!isRunning && previousRunningState.current) {
      // Pausing the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Update the ref to track the current running state
    previousRunningState.current = isRunning;
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
