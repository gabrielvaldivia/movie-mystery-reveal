
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
      
      // Set up progress simulation
      progressIntervalRef.current = setInterval(() => {
        if (loadingProgressRef.current < 90) {
          loadingProgressRef.current += 5;
          setLoadingProgress(loadingProgressRef.current);
        } else {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }
      }, duration / 20); // Divide duration to get appropriate interval steps
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
