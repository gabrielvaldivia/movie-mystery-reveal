import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../utils/types/movieTypes';
import { getRandomMovie, getNextMovie } from '../utils/gameData';

export function useGameState() {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);
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
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameDuration, setGameDuration] = useState(30000); // 30 seconds

  const startNewRound = useCallback(async () => {
    setIsLoading(true);
    setIsImageLoaded(false);
    setShowSuccessDialog(false);
    setTimeExpired(false);
    setImageLoadError(false);
    setIsGameActive(false);
    setIsRoundComplete(false);
    setCurrentRoundScore(0);
    setTimeRemaining(gameDuration);
    
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
  }, [currentMovie, gameDuration]);

  useEffect(() => {
    if (!gameInitialized) {
      const initGame = async () => {
        setIsLoading(true);
        setLoadingProgress(0);
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
    setCurrentRoundScore(0);
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
  }, []);

  const updateTimeRemaining = useCallback((time: number) => {
    console.log(`Time updated: ${time}ms / ${gameDuration}ms`);
    setTimeRemaining(time);
  }, [gameDuration]);

  const calculateScore = (remainingTime: number) => {
    const validTime = Math.max(0, Math.min(remainingTime, gameDuration));
    const timePercentage = validTime / gameDuration;
    
    const adjustedPercentage = Math.pow(timePercentage, 2.0);
    
    const finalScore = Math.round(adjustedPercentage * 100);
    console.log(`Score calculation: ${timePercentage.toFixed(2)} → ${adjustedPercentage.toFixed(2)} → ${finalScore}`);
    
    return finalScore;
  };

  const handleGuess = (guess: string) => {
    if (!currentMovie || !isGameActive) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      const currentTime = timeRemaining;
      const roundScore = calculateScore(currentTime);
      console.log(`Time remaining: ${currentTime}ms / ${gameDuration}ms (${Math.round((currentTime/gameDuration)*100)}%), Score: ${roundScore}/100`);
      
      setCurrentRoundScore(roundScore);
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(true);
      setScore(prev => prev + roundScore);
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
      setCurrentRoundScore(0);
      setShowSuccessDialog(true);
    }
  };

  const handleImageLoaded = () => {
    setIsImageLoaded(true);
    setIsGameActive(true);
    setTimeRemaining(gameDuration);
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
    currentRoundScore,
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
    updateTimeRemaining,
    timeRemaining,
    gameDuration
  };
}
