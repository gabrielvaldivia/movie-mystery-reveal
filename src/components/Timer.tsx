
import React, { useState, useEffect, useRef } from 'react';
import { Progress } from './ui/progress';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onTimeUpdate?: (timeRemaining: number) => void;
}

const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning,
  onTimeUpdate 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [progressValue, setProgressValue] = useState(100); // Separate state for progress
  const timerRef = useRef<number | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  const lastTickTimeRef = useRef<number | null>(null);
  
  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
    setProgressValue(100);
    hasStartedRef.current = false;
    lastTickTimeRef.current = null;
    
    // Report initial time
    if (onTimeUpdate) {
      onTimeUpdate(duration);
    }
  }, [duration, onTimeUpdate]);
  
  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);
  
  // Handle running state changes
  useEffect(() => {
    // Clear any existing interval first
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    // Start timer if running and we have time left
    if (isRunning && timeRemaining > 0) {
      hasStartedRef.current = true;
      lastTickTimeRef.current = Date.now();
      
      const tick = () => {
        const now = Date.now();
        const elapsed = lastTickTimeRef.current ? now - lastTickTimeRef.current : 100;
        lastTickTimeRef.current = now;
        
        setTimeRemaining(prev => {
          // Force a minimum time decrease of at least 50ms per tick for visual feedback
          const newTime = Math.max(0, prev - Math.max(elapsed, 50));
          
          // Calculate progress percentage
          const newProgress = Math.max(0, Math.min(100, (newTime / duration) * 100));
          
          // Set progress with a slightly delayed state update for visibility
          setProgressValue(prevProgress => {
            // Ensure the progress visibly changes even for small updates
            const diffThreshold = 0.5; // Minimum change threshold
            return Math.abs(prevProgress - newProgress) < diffThreshold 
              ? prevProgress - diffThreshold 
              : newProgress;
          });
          
          // Report time update to parent
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          
          if (newTime <= 0) {
            cancelAnimationFrame(timerRef.current as number);
            timerRef.current = null;
            
            // Only trigger time up if the timer has actually been running
            if (hasStartedRef.current) {
              setTimeout(() => onTimeUp(), 0);
            }
            return 0;
          }
          return newTime;
        });
        
        // Continue the animation frame if still running
        if (isRunning) {
          timerRef.current = requestAnimationFrame(tick);
        }
      };
      
      // Start the animation frame loop for smoother animation
      timerRef.current = requestAnimationFrame(tick);
    } else if (!isRunning) {
      // If we're paused, update the last tick time to now so we don't count
      // the paused time when we resume
      lastTickTimeRef.current = null;
      
      // Cancel any running animation frame
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current as number);
        timerRef.current = null;
      }
    }
    
    // Return cleanup function
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current as number);
        timerRef.current = null;
      }
    };
  }, [isRunning, onTimeUp, onTimeUpdate, duration]);
  
  console.log(`Timer progress: ${progressValue.toFixed(1)}% (${timeRemaining}ms / ${duration}ms)`);
  
  return (
    <div className="w-full">
      <Progress 
        value={progressValue} 
        className="h-4 w-full rounded-md bg-gray-700/40" 
        indicatorClassName="bg-white/90 transition-none animate-pulse-subtle" 
      />
    </div>
  );
};

export default Timer;
