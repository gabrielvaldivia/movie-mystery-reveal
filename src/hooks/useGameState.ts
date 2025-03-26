import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../utils/types/movieTypes';
import { getRandomMovie, getNextMovie } from '../utils/gameData';

export function useGameState() {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [imageLoadTimeout, setImageLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  const startNewRound = useCallback(async () => {
    setIsLoading(true);
    setIsImageLoaded(false);
    setShowSuccessDialog(false);
    setTimeExpired(false);
    setImageLoadError(false);
    setIsGameActive(false);
    setIsRoundComplete(false);
    setLoadingProgress(10); // Start with some initial progress for immediate feedback
    
    if (imageLoadTimeout) {
      clearTimeout(imageLoadTimeout);
    }
    
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    // Setup a more dynamic progress animation
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Add a random increment to make it feel more natural
        const increment = Math.random() * 4 + 1;
        const newValue = prev + increment;
        return newValue >= 90 ? 90 : newValue; // Cap at 90% until actual load completes
      });
    }, 200);
    
    setProgressInterval(interval);
    
    try {
      setImageKey(Date.now());
      
      const nextMovie = currentMovie 
        ? await getNextMovie(currentMovie.id) 
        : await getRandomMovie();
      
      console.log(`Loaded movie: "${nextMovie.title}" (${nextMovie.releaseYear})`);
      
      setCurrentMovie(nextMovie);
      setIsCorrectGuess(false);
      setHasIncorrectGuess(false);
      
      const timeout = setTimeout(() => {
        console.log("Image load timeout triggered - forcing game start");
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        setIsLoading(false);
        setIsImageLoaded(true);
        setIsGameActive(true);
        setLoadingProgress(100);
      }, 10000);
      
      setImageLoadTimeout(timeout);
      
    } catch (error) {
      console.error("Error starting new round:", error);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setImageLoadError(true);
      setIsLoading(false);
      setLoadingProgress(100);
    }
  }, [currentMovie, imageLoadTimeout, progressInterval]);

  useEffect(() => {
    if (!gameInitialized) {
      const initGame = async () => {
        setIsLoading(true);
        setLoadingProgress(0);
        
        // Add a tiny delay to ensure the loading screen appears with initial progress
        setTimeout(() => {
          setLoadingProgress(5);
        }, 100);
        
        try {
          // Initialize game with progressively updating loading indicator
          const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
              const newProgress = prev + (Math.random() * 3 + 1);
              return newProgress >= 80 ? 80 : newProgress; // Cap at 80% until actual game loads
            });
          }, 200);
          
          await startNewRound();
          
          clearInterval(progressInterval);
          setGameInitialized(true);
        } catch (error) {
          console.error("Error initializing game:", error);
          setLoadingProgress(100);
          setIsLoading(false);
          setImageLoadError(true);
        }
      };
      
      initGame();
    }
    
    return () => {
      if (imageLoadTimeout) {
        clearTimeout(imageLoadTimeout);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [gameInitialized, startNewRound, imageLoadTimeout, progressInterval]);

  const resetGame = useCallback(() => {
    if (imageLoadTimeout) {
      clearTimeout(imageLoadTimeout);
    }
    
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    setCurrentMovie(null);
    setIsGameActive(false);
    setIsRoundComplete(false);
    setScore(0);
    setIsCorrectGuess(false);
    setIsLoading(true);
    setHasIncorrectGuess(false);
    setIsImageLoaded(false);
    setImageKey(Date.now());
    setShowSuccessDialog(false);
    setLoadingProgress(0);
    setTimeExpired(false);
    setImageLoadError(false);
    setGameInitialized(false);
  }, [imageLoadTimeout, progressInterval]);

  const handleGuess = (guess: string) => {
    if (!currentMovie || !isGameActive) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(true);
      setScore(prev => prev + 100);
      setShowSuccessDialog(true);
    } else {
      setHasIncorrectGuess(true);
      setTimeout(() => {
        setHasIncorrectGuess(false);
      }, 1000);
    }
  };

  const handleTimeUp = () => {
    if (isGameActive && !isRoundComplete) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      setTimeExpired(true);
      setShowSuccessDialog(true);
    }
  };

  const handleImageLoaded = () => {
    console.log("Image loaded successfully - activating game");
    
    if (imageLoadTimeout) {
      clearTimeout(imageLoadTimeout);
      setImageLoadTimeout(null);
    }
    
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    setIsImageLoaded(true);
    setLoadingProgress(100);
    setIsLoading(false);
    setIsGameActive(true);
  };
  
  const handleImageError = () => {
    console.error("Error loading image - attempting to load next movie");
    
    if (imageLoadTimeout) {
      clearTimeout(imageLoadTimeout);
      setImageLoadTimeout(null);
    }
    
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    setImageLoadError(true);
    setIsLoading(false);
    setLoadingProgress(100);
    setTimeout(() => {
      startNewRound();
    }, 2000);
  };
  
  const handleRevealComplete = () => {
    if (isGameActive && !isRoundComplete) {
      handleTimeUp();
    }
  };
  
  const handleNextRound = async () => {
    setScore(0);
    await startNewRound();
  };
  
  const handleSkip = async () => {
    if (isGameActive) {
      setIsGameActive(false);
      setIsRoundComplete(false);
      setTimeExpired(false);
      setShowSuccessDialog(false);
      setIsCorrectGuess(false);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await startNewRound();
    }
  };

  return {
    currentMovie,
    isGameActive,
    isRoundComplete,
    score,
    isCorrectGuess,
    isLoading,
    hasIncorrectGuess,
    isImageLoaded,
    imageKey,
    showSuccessDialog,
    loadingProgress,
    timeExpired,
    imageLoadError,
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleImageError,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
    resetGame,
  };
}
