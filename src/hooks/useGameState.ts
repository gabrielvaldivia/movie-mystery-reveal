import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie } from '../utils/types/movieTypes';
import { resetMoviePools, getNextGameMovie } from '../utils/services/gameMovieService';
import { Difficulty } from '../lib/supabase';

export function useGameState(difficulty: Difficulty) {
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const MAX_LIVES = 5;
  const [lives, setLives] = useState(MAX_LIVES);
  const [isGameOver, setIsGameOver] = useState(false);
  const [remainingTimeMs, setRemainingTimeMs] = useState(0);

  // Clear any existing transition timeout
  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTransitionTimeout();
  }, []);

  const startNewRound = useCallback(async (livesOverride?: number) => {
    console.log('startNewRound called');
    
    // If we're loading or transitioning, don't start a new round
    if (isLoading || isTransitioning) {
      console.log('Already loading or transitioning, skipping startNewRound');
      return;
    }
    
    const currentLivesValue = livesOverride !== undefined ? livesOverride : lives;
    
    if (currentLivesValue <= 0) {
      console.log('No lives left, ending game');
      setIsGameOver(true);
      return;
    }
    
    if (livesOverride !== undefined) {
      setLives(livesOverride);
    }
    
    setIsLoading(true);
    setIsImageLoaded(false);
    setShowSuccessDialog(false);
    setTimeExpired(false);
    setImageLoadError(false);
    setIsRoundComplete(false);
    setIsTransitioning(false);
    
    try {
      setImageKey(Date.now());
      
      const nextMovie = await getNextGameMovie();
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
  }, [lives, isLoading, isTransitioning]);

  useEffect(() => {
    if (!gameInitialized) {
      const initGame = async () => {
        setIsLoading(true);
        setLoadingProgress(0);
        setLives(MAX_LIVES);
        setScore(0);
        setIsGameOver(false);
        
        try {
          // Start progress animation
          const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
              const newProgress = prev + (100 - prev) * 0.1;
              return newProgress >= 99 ? 99 : newProgress;
            });
          }, 200);
          
          // Reset movie pools first
          await resetMoviePools();
          
          // Clear interval before starting new round
          clearInterval(progressInterval);
          setLoadingProgress(100);
          
          // Initialize first round
          const nextMovie = await getNextGameMovie();
          setCurrentMovie(nextMovie);
          setIsCorrectGuess(false);
          setHasIncorrectGuess(false);
          setIsLoading(false);
          setGameInitialized(true);
          
          console.log('Game initialized with movie:', nextMovie.title);
        } catch (error) {
          console.error("Error initializing game:", error);
          setLoadingProgress(100);
          setIsLoading(false);
          setImageLoadError(true);
        }
      };
      
      initGame();
    }
  }, [gameInitialized]);

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
    setGameInitialized(false);
    setLives(MAX_LIVES);
    setIsGameOver(false);
    
    resetMoviePools().catch(error => {
      console.error("Error resetting movie pools:", error);
    });
  }, []);

  const handleGuess = (guess: string) => {
    if (!currentMovie || !isGameActive || isTransitioning) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    console.log('Guess made:', { guess, normalizedGuess, normalizedTitle, isCorrect });
    
    if (isCorrect) {
      // Calculate points before any state changes
      const pointsToAdd = Math.round(remainingTimeMs / 1000);
      
      // Set all state updates immediately
      setIsCorrectGuess(true);
      setIsTransitioning(true);
      setIsGameActive(false);
      setIsRoundComplete(true);
      setScore(prev => prev + pointsToAdd);
      
      console.log('Correct guess! Adding points and proceeding...');
      
      if (difficulty === 'easy') {
        // In easy mode, automatically proceed to next round after a short delay
        console.log('Correct guess in easy mode, waiting 2 seconds before next round');
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
          startNewRound();
        }, 2000);
      } else {
        // In hard mode, show the success dialog
        console.log('Correct guess in hard mode, showing success dialog');
        setShowSuccessDialog(true);
        setIsTransitioning(false);
      }
      return;
    }
    
    // Handle incorrect guess
    console.log('Incorrect guess, reducing lives...');
    
    // Batch incorrect guess state updates
    setIsTransitioning(true);
    setLives(prev => Math.max(0, prev - 1));
    setHasIncorrectGuess(true);
    
    setTimeout(() => {
      setHasIncorrectGuess(false);
    }, 1000);
    
    if (lives <= 1) {
      setTimeout(() => {
        setIsGameOver(true);
      }, 1000);
    } else if (difficulty === 'easy') {
      // In easy mode, proceed to next round after showing incorrect state
      setIsGameActive(false);
      setIsRoundComplete(true);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        startNewRound();
      }, 2000);
    } else {
      setIsTransitioning(false);
    }
  };

  const handleTimeUp = () => {
    // Don't reduce lives if:
    // 1. Game is not active
    // 2. Round is complete (correct guess was made)
    // 3. Already transitioning
    // 4. Correct guess was made
    // 5. Game is over
    if (!isGameActive || isRoundComplete || isTransitioning || isCorrectGuess || isGameOver) {
      console.log('handleTimeUp called but prevented due to state:', {
        isGameActive,
        isRoundComplete,
        isTransitioning,
        isCorrectGuess,
        isGameOver
      });
      return;
    }

    const newLives = Math.max(0, lives - 1);
    console.log(`Time up: Reducing lives from ${lives} to ${newLives}`);
    
    setLives(newLives);
    setIsGameActive(false);
    setIsTransitioning(true);
    
    if (newLives <= 0) {
      console.log("No lives left, ending game");
      setTimeout(() => {
        setIsGameOver(true);
      }, 1000);
    } else if (difficulty === 'easy') {
      // In easy mode, automatically proceed to next round after a short delay
      clearTransitionTimeout();
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        startNewRound(newLives);
      }, 2000);
    } else {
      // In hard mode, show the success dialog to reveal the answer
      setIsRoundComplete(true);
      setTimeExpired(true);
      setShowSuccessDialog(true);
      setIsTransitioning(false);
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
    // Don't trigger time up if:
    // 1. We're already transitioning
    // 2. We're in easy mode with game inactive
    // 3. The round is complete (correct guess was made)
    // 4. The game is not active
    // 5. A correct guess was made
    // 6. The game is over
    if (!isGameActive || 
        isRoundComplete || 
        isTransitioning || 
        isCorrectGuess || 
        isGameOver || 
        (difficulty === 'easy' && !isGameActive)) {
      console.log('handleRevealComplete prevented time up due to state:', {
        isGameActive,
        isRoundComplete,
        isTransitioning,
        isCorrectGuess,
        isGameOver,
        difficulty,
      });
      return;
    }
    
    console.log('handleRevealComplete triggering time up');
    handleTimeUp();
  };
  
  const handleNextRound = async () => {
    if (!isTransitioning) {
      await startNewRound();
    }
  };
  
  const handleSkip = async () => {
    if (isGameActive && !isTransitioning) {
      const newLives = Math.max(0, lives - 1);
      console.log(`Skip: Reducing lives from ${lives} to ${newLives}`);
      
      setLives(newLives);
      setIsGameActive(false);
      setIsRoundComplete(false);
      setTimeExpired(false);
      setShowSuccessDialog(false);
      setIsCorrectGuess(false);
      setIsTransitioning(true);
      
      if (newLives <= 0) {
        console.log("No lives left, ending game");
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
      } else {
        console.log(`${newLives} lives left, continuing to next round`);
        await startNewRound(newLives);
      }
    }
  };
  
  const handleSubmitScore = (playerName: string) => {
    console.log(`Score submission completed for ${playerName}: ${score}`);
    // Reset the game state after score submission
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
