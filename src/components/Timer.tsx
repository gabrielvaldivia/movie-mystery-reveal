
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
  const hasStartedRef = useRef<boolean>(false);
  const lastRunningStateRef = useRef<boolean>(isRunning);
  
  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
    hasStartedRef.current = false;
  }, [duration]);
  
  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle running state changes
  useEffect(() => {
    // Clear any existing interval first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Start timer if running and we have time left
    if (isRunning && timeRemaining > 0) {
      hasStartedRef.current = true;
      
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 100) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            // Only trigger time up if the timer has actually been running
            if (hasStartedRef.current) {
              setTimeout(() => onTimeUp(), 0);
            }
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }
    
    // Store the last running state for comparison
    lastRunningStateRef.current = isRunning;
    
    // Return cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, onTimeUp, timeRemaining]);
  
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
