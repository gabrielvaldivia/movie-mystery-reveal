
import { useState, useRef, useEffect } from 'react';

interface UseLoadingProgressProps {
  isLoading: boolean;
  duration?: number;
}

export function useLoadingProgress({ 
  isLoading, 
  duration = 1500 // Reduce default duration to 1.5 seconds
}: UseLoadingProgressProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingProgressRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      loadingProgressRef.current = 0;
      setLoadingProgress(0);
      
      // Immediate visual feedback with a larger initial progress
      setTimeout(() => {
        loadingProgressRef.current = 20;
        setLoadingProgress(20);
      }, 50); // Faster initial feedback
      
      // Set up progress simulation with more frequent updates
      progressIntervalRef.current = setInterval(() => {
        if (loadingProgressRef.current < 85) {
          // Larger increments for faster progress
          const increment = Math.random() * 8 + 5;
          loadingProgressRef.current += increment;
          setLoadingProgress(loadingProgressRef.current);
        } else {
          // Faster progression at the end
          if (loadingProgressRef.current < 95) {
            loadingProgressRef.current += 1;
            setLoadingProgress(loadingProgressRef.current);
          } else {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }
      }, duration / 60); // Even more frequent updates for smoother animation
    } else {
      // Clean up interval if loading stops
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Jump to 100% when loading completes
      if (loadingProgressRef.current > 0) {
        loadingProgressRef.current = 100;
        setLoadingProgress(100);
      }
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isLoading, duration]);

  const resetProgress = () => {
    loadingProgressRef.current = 0;
    setLoadingProgress(0);
  };

  return {
    loadingProgress,
    resetProgress
  };
}
