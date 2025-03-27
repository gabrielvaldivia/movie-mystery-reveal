
import { useState, useEffect } from 'react';

interface UseLoadingProgressProps {
  isLoading: boolean;
  duration?: number;
}

export function useLoadingProgress({ 
  isLoading, 
  duration = 3000 // Not really used anymore, just a placeholder
}: UseLoadingProgressProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setLoadingProgress(0);
      
      // Just three fixed steps, no complex animations
      const step1 = setTimeout(() => setLoadingProgress(33), 300);
      const step2 = setTimeout(() => setLoadingProgress(66), 600);
      const step3 = setTimeout(() => setLoadingProgress(100), 900);
      
      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
      };
    } else {
      // Jump to 100% when loading completes
      setLoadingProgress(100);
    }
  }, [isLoading]);

  return {
    loadingProgress,
    resetProgress: () => setLoadingProgress(0)
  };
}
