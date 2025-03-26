
import { useState, useEffect } from 'react';
import { Movie, getRandomMovie, getNextMovie, loadAllMovieImages } from '../utils/gameData';

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

  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      try {
        // Simulate progressive loading of all game assets
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            const newProgress = prev + (100 - prev) * 0.1;
            return newProgress >= 99 ? 99 : newProgress;
          });
        }, 200);
        
        await loadAllMovieImages();
        await startNewRound();
        
        clearInterval(progressInterval);
        setLoadingProgress(100);
      } catch (error) {
        console.error("Error initializing game:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initGame();
  }, []);
  
  const startNewRound = async () => {
    setIsLoading(true);
    setIsImageLoaded(false);
    setShowSuccessDialog(false);
    setTimeExpired(false);
    
    try {
      // Generate a new image key to force re-mounting of MovieImage
      setImageKey(Date.now());
      
      const nextMovie = currentMovie 
        ? await getNextMovie(currentMovie.id) 
        : await getRandomMovie();
      
      setCurrentMovie(nextMovie);
      setIsRoundComplete(false);
      setIsCorrectGuess(false);
      setHasIncorrectGuess(false);
      // We'll set isGameActive to true after the image is loaded
    } catch (error) {
      console.error("Error starting new round:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!isRoundComplete) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      setTimeExpired(true);
      setShowSuccessDialog(true);
    }
  };

  const handleImageLoaded = () => {
    setIsImageLoaded(true);
    // Now that the image is loaded, we can start the game
    setIsGameActive(true);
  };
  
  const handleRevealComplete = () => {
    if (!isRoundComplete) {
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
      setIsRoundComplete(true);
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
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
  };
}
