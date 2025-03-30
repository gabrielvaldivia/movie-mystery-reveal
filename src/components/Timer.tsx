
import React, { useState, useEffect, useRef } from 'react';
import { Progress } from './ui/progress';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onTimeUpdate?: (remainingMs: number) => void;
}

const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning,
  onTimeUpdate
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const timerRef = useRef<number | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  const lastTickTimeRef = useRef<number | null>(null);
  
  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
    hasStartedRef.current = false;
    lastTickTimeRef.current = null;
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
      lastTickTimeRef.current = Date.now();
      
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = lastTickTimeRef.current ? now - lastTickTimeRef.current : 100;
        lastTickTimeRef.current = now;
        
        setTimeRemaining((prev) => {
          const newTime = Math.max(0, prev - elapsed);
          
          // Report remaining time to parent
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          
          if (newTime <= 0) {
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
          return newTime;
        });
      }, 100);
    } else if (!isRunning) {
      // If we're paused, update the last tick time to now so we don't count
      // the paused time when we resume
      lastTickTimeRef.current = null;
    }
    
    // Return cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, onTimeUp, timeRemaining, onTimeUpdate]);
  
  // Calculate progress as a percentage from 0 to 100
  // Inverting the calculation so it fills from left to right as time decreases
  const progress = 100 - Math.max(0, (timeRemaining / duration) * 100);
  
  return (
    <div className="w-full">
      <Progress 
        value={progress} 
        className="h-1 w-full rounded-none bg-gray-700" 
        indicatorClassName="bg-white"
      />
    </div>
  );
};

export default Timer;
