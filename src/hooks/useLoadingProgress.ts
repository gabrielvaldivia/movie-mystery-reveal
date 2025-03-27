
import { useState, useEffect } from 'react';

interface UseLoadingProgressProps {
  isLoading: boolean;
  duration?: number;
}

export function useLoadingProgress({ 
  isLoading, 
  duration = 3000 // Shorter duration
}: UseLoadingProgressProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setLoadingProgress(0);
      
      // Simple linear progress - just 4 steps
      const step1 = setTimeout(() => setLoadingProgress(25), 200);
      const step2 = setTimeout(() => setLoadingProgress(50), 500);
      const step3 = setTimeout(() => setLoadingProgress(75), 1000);
      
      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
      };
    } else {
      // Jump to 100% when loading completes
      setLoadingProgress(100);
    }
  }, [isLoading, duration]);

  const resetProgress = () => {
    setLoadingProgress(0);
  };

  return {
    loadingProgress,
    resetProgress
  };
}
