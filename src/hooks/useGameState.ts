
import { useEffect } from 'react';
import { useGameInit } from './useGameInit';
import { useGameRound } from './useGameRound';
import { useGameScore } from './useGameScore';
import { useGameActions } from './useGameActions';

export function useGameState() {
  // Initialize game state management hooks
  const MAX_LIVES = 10;
  
  const {
    isLoading: initIsLoading,
    loadingProgress,
    gameInitialized,
    setGameInitialized,
    imageLoadError,
    setImageLoadError,
    initializeGame
  } = useGameInit();
  
  const scoreState = useGameScore(MAX_LIVES);
  const {
    lives,
    maxLives,
    isGameOver,
    setLives,
    setIsGameOver
  } = scoreState;
  
  const roundState = useGameRound(lives, setIsGameOver, setLives);
  const {
    isLoading: roundIsLoading,
    setIsLoading,
    startNewRound
  } = roundState;
  
  const actions = useGameActions(roundState, scoreState);
  
  // Combine loading states
  const isLoading = initIsLoading || roundIsLoading;
  
  // Initialize game on startup
  useEffect(() => {
    if (!gameInitialized) {
      const initGame = async () => {
        setLives(MAX_LIVES);
        await initializeGame(startNewRound);
      };
      
      initGame();
    }
  }, [gameInitialized, initializeGame, startNewRound, setLives]);
  
  // Combine all hooks for the final API
  const resetGame = () => {
    setIsLoading(true);
    setGameInitialized(false);
    setImageLoadError(false);
    actions.resetGame();
  };
  
  return {
    // From roundState
    currentMovie: roundState.currentMovie,
    isGameActive: roundState.isGameActive,
    isRoundComplete: roundState.isRoundComplete,
    isCorrectGuess: roundState.isCorrectGuess,
    hasIncorrectGuess: roundState.hasIncorrectGuess,
    isImageLoaded: roundState.isImageLoaded,
    imageKey: roundState.imageKey,
    showSuccessDialog: roundState.showSuccessDialog,
    timeExpired: roundState.timeExpired,
    
    // From scoreState
    score: scoreState.score,
    lives,
    maxLives,
    isGameOver,
    
    // From gameInit
    isLoading,
    loadingProgress,
    imageLoadError,
    
    // From actions
    handleGuess: actions.handleGuess,
    handleTimeUp: actions.handleTimeUp,
    handleImageLoaded: actions.handleImageLoaded,
    handleImageError: actions.handleImageError,
    handleRevealComplete: actions.handleRevealComplete,
    handleNextRound: actions.handleNextRound,
    handleSkip: actions.handleSkip,
    handleSubmitScore: actions.handleSubmitScore,
    
    // Combined actions
    resetGame,
    
    // Additional functions
    updateRemainingTime: scoreState.updateRemainingTime,
  };
}
