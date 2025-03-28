
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
  const [progressValue, setProgressValue] = useState(100);
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
    
    console.log(`Timer reset with duration: ${duration}ms, progress: 100%`);
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
    
    console.log(`Timer state changed: running=${isRunning}, time=${timeRemaining}ms`);
    
    // Start timer if running and we have time left
    if (isRunning && timeRemaining > 0) {
      hasStartedRef.current = true;
      lastTickTimeRef.current = Date.now();
      console.log(`Timer starting: ${timeRemaining}ms remaining`);
      
      const tick = () => {
        const now = Date.now();
        const elapsed = lastTickTimeRef.current ? now - lastTickTimeRef.current : 16;
        lastTickTimeRef.current = now;
        
        setTimeRemaining(prev => {
          // Calculate time decrease (minimum 16ms per frame for visual feedback)
          const newTime = Math.max(0, prev - Math.max(elapsed, 16));
          
          // Calculate new progress percentage (reversed: 100% to 0%)
          const newProgressValue = Math.max(0, (newTime / duration) * 100);
          
          // Update progress bar value with more aggressive updates
          setProgressValue(prevProgress => {
            // Ensure visible movement by decreasing by at least 0.25% each frame
            const minDecrement = 0.25;
            const nextProgress = Math.min(prevProgress, newProgressValue);
            const visibleProgress = Math.max(nextProgress, prevProgress - minDecrement);
            return visibleProgress;
          });
          
          // Report time update to parent
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          
          // Log progress periodically (only every ~1 second to avoid flooding)
          if (Math.random() < 0.05) {
            console.log(`Timer: ${newTime.toFixed(0)}ms / ${duration}ms (${(newTime/duration*100).toFixed(1)}%)`);
          }
          
          // Handle timer completion
          if (newTime <= 0) {
            console.log('Timer complete!');
            cancelAnimationFrame(timerRef.current as number);
            timerRef.current = null;
            
            // Only trigger time up if the timer has actually been running
            if (hasStartedRef.current) {
              console.log('Timer triggering onTimeUp callback');
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
      
      // Start the animation frame loop
      timerRef.current = requestAnimationFrame(tick);
    } else if (!isRunning) {
      // If we're paused, update the last tick time to now so we don't count
      // the paused time when we resume
      lastTickTimeRef.current = null;
      console.log(`Timer paused at ${timeRemaining}ms`);
      
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
  
  return (
    <div className="w-full">
      <Progress 
        value={progressValue} 
        className="h-6 w-full rounded-md bg-black/30" 
        indicatorClassName="bg-primary transition-none" 
      />
    </div>
  );
};

export default Timer;
