
import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../utils/types/movieTypes';
import { getRandomMovie } from '../utils/gameData';

export interface UseGameInitResult {
  isLoading: boolean;
  loadingProgress: number;
  gameInitialized: boolean;
  setGameInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  imageLoadError: boolean;
  setImageLoadError: React.Dispatch<React.SetStateAction<boolean>>;
  initializeGame: (callback: () => Promise<void>) => Promise<void>;
}

export function useGameInit(): UseGameInitResult {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const initializeGame = useCallback(async (startNewRoundCallback: () => Promise<void>) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return newProgress >= 99 ? 99 : newProgress;
        });
      }, 200);
      
      await startNewRoundCallback();
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setGameInitialized(true);
    } catch (error) {
      console.error("Error initializing game:", error);
      setLoadingProgress(100);
      setIsLoading(false);
      setImageLoadError(true);
    }
  }, []);

  return {
    isLoading,
    loadingProgress,
    gameInitialized,
    setGameInitialized,
    imageLoadError,
    setImageLoadError,
    initializeGame
  };
}
