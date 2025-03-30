
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
  
  // Add lives tracking
  const MAX_LIVES = 10;
  const [lives, setLives] = useState(MAX_LIVES);
  const [isGameOver, setIsGameOver] = useState(false);
  const [remainingTimeMs, setRemainingTimeMs] = useState(0);

  const startNewRound = useCallback(async () => {
    // Check if game is over before starting a new round
    if (lives <= 0) {
      setIsGameOver(true);
      return;
    }
    
    setIsLoading(true);
    setIsImageLoaded(false);
    setShowSuccessDialog(false);
    setTimeExpired(false);
    setImageLoadError(false);
    setIsGameActive(false);
    setIsRoundComplete(false);
    
    try {
      setImageKey(Date.now());
      
      const nextMovie = currentMovie 
        ? await getNextMovie(currentMovie.id) 
        : await getRandomMovie();
      
      console.log(`Loaded movie: "${nextMovie.title}" (${nextMovie.releaseYear})`);
      
      setCurrentMovie(nextMovie);
      setIsCorrectGuess(false);
      setHasIncorrectGuess(false);
    } catch (error) {
      console.error("Error starting new round:", error);
      setImageLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentMovie, lives]);

  // Initialize game on first load only
  useEffect(() => {
    if (!gameInitialized) {
      const initGame = async () => {
        setIsLoading(true);
        setLoadingProgress(0);
        setLives(MAX_LIVES);
        setScore(0);
        setIsGameOver(false);
        
        try {
          const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
              const newProgress = prev + (100 - prev) * 0.1;
              return newProgress >= 99 ? 99 : newProgress;
            });
          }, 200);
          
          await startNewRound();
          
          clearInterval(progressInterval);
          setLoadingProgress(100);
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
  }, [gameInitialized, startNewRound]);

  const resetGame = useCallback(() => {
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
    setGameInitialized(false); // Reset initialized state to trigger a fresh load
    setLives(MAX_LIVES);
    setIsGameOver(false);
  }, []);

  const handleGuess = (guess: string) => {
    if (!currentMovie || !isGameActive) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      // Add points based on remaining time
      const pointsToAdd = Math.round(remainingTimeMs / 1000);
      setScore(prev => prev + pointsToAdd);
      
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(true);
      setShowSuccessDialog(true);
    } else {
      // Deduct a life for incorrect guess
      setLives(prev => Math.max(0, prev - 1));
      
      setHasIncorrectGuess(true);
      setTimeout(() => {
        setHasIncorrectGuess(false);
      }, 1000);
      
      // Check if game over
      if (lives <= 1) {
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
      }
    }
  };

  const handleTimeUp = () => {
    if (isGameActive && !isRoundComplete) {
      // Deduct a life when time is up
      setLives(prev => {
        const newLives = Math.max(0, prev - 1);
        if (newLives <= 0) {
          setIsGameOver(true);
        }
        return newLives;
      });
      
      setIsGameActive(false);
      setIsRoundComplete(true);
      setTimeExpired(true);
      
      // Don't show success dialog when time expires, go directly to next round
      if (lives > 1) {
        setTimeout(() => {
          startNewRound();
        }, 1000);
      }
    }
  };

  const handleImageLoaded = () => {
    setIsImageLoaded(true);
    setIsGameActive(true);
  };
  
  const handleImageError = () => {
    setImageLoadError(true);
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
    await startNewRound();
  };
  
  const handleSkip = async () => {
    if (isGameActive) {
      // Deduct a life for skipping
      setLives(prev => {
        const newLives = Math.max(0, prev - 1);
        if (newLives <= 0) {
          setIsGameOver(true);
          return 0;
        }
        return newLives;
      });
      
      setIsGameActive(false);
      setIsRoundComplete(false);
      setTimeExpired(false);
      setShowSuccessDialog(false);
      setIsCorrectGuess(false);
      
      // Only start new round if we still have lives
      if (lives > 1) {
        await new Promise(resolve => setTimeout(resolve, 10));
        await startNewRound();
      }
    }
  };
  
  const handleSubmitScore = (playerName: string) => {
    // This would typically save the score to a database or localStorage
    console.log(`Saving score for ${playerName}: ${score}`);
    // For now, just reset the game
    resetGame();
  };
  
  const updateRemainingTime = (timeMs: number) => {
    setRemainingTimeMs(timeMs);
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
    lives,
    maxLives: MAX_LIVES,
    isGameOver,
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleImageError,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
    resetGame,
    handleSubmitScore,
    updateRemainingTime,
  };
}
