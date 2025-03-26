
import { useState, useRef, useEffect } from 'react';

interface UseLoadingProgressProps {
  isLoading: boolean;
  duration?: number;
}

export function useLoadingProgress({ 
  isLoading, 
  duration = 3000 
}: UseLoadingProgressProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingProgressRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      loadingProgressRef.current = 0;
      setLoadingProgress(0);
      
      // Start immediate visual feedback with a small progress increment
      setTimeout(() => {
        loadingProgressRef.current = 10;
        setLoadingProgress(10);
      }, 100);
      
      // Set up progress simulation with smaller, more frequent updates
      progressIntervalRef.current = setInterval(() => {
        if (loadingProgressRef.current < 85) {
          // Add a random increment between 3-8% to make it feel more dynamic
          const increment = Math.random() * 5 + 3;
          loadingProgressRef.current += increment;
          setLoadingProgress(loadingProgressRef.current);
        } else {
          // Slow down at the end to simulate waiting for final resources
          if (loadingProgressRef.current < 95) {
            loadingProgressRef.current += 0.5;
            setLoadingProgress(loadingProgressRef.current);
          } else {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }
      }, duration / 40); // More frequent updates for smoother animation
    } else {
      // Clean up interval if loading stops
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // If loading completed successfully, set progress to 100%
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
