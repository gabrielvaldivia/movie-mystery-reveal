
import { useCallback } from 'react';
import { Movie } from '../utils/types/movieTypes';
import { UseGameRoundResult } from './useGameRound';
import { UseGameScoreResult } from './useGameScore';

export interface UseGameActionsResult {
  handleGuess: (guess: string) => void;
  handleTimeUp: () => void;
  handleImageLoaded: () => void;
  handleImageError: () => void;
  handleRevealComplete: () => void;
  handleNextRound: () => Promise<void>;
  handleSkip: () => void;
  resetGame: () => void;
  handleSubmitScore: (playerName: string) => void;
}

export function useGameActions(
  roundState: UseGameRoundResult,
  scoreState: UseGameScoreResult
): UseGameActionsResult {
  const {
    currentMovie,
    isGameActive,
    isRoundComplete,
    startNewRound,
    setIsGameActive,
    setIsRoundComplete,
    setShowSuccessDialog,
    setTimeExpired,
    setIsCorrectGuess,
    setHasIncorrectGuess,
    setIsImageLoaded
  } = roundState;

  const {
    lives,
    remainingTimeMs,
    setScore,
    setLives,
    setIsGameOver,
    resetScoreAndLives
  } = scoreState;

  const handleGuess = useCallback((guess: string) => {
    if (!currentMovie || !isGameActive) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      const pointsToAdd = Math.round(remainingTimeMs / 1000);
      setScore(prev => prev + pointsToAdd);
      
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(true);
      setShowSuccessDialog(true);
    } else {
      setLives(prev => Math.max(0, prev - 1));
      
      setHasIncorrectGuess(true);
      setTimeout(() => {
        setHasIncorrectGuess(false);
      }, 1000);
      
      if (lives <= 1) {
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
      }
    }
  }, [currentMovie, isGameActive, remainingTimeMs, lives, setScore, setLives, setIsGameOver, setIsGameActive, setIsRoundComplete, setIsCorrectGuess, setShowSuccessDialog, setHasIncorrectGuess]);

  const handleTimeUp = useCallback(() => {
    if (isGameActive && !isRoundComplete) {
      const newLives = Math.max(0, lives - 1);
      console.log(`Time up: Reducing lives from ${lives} to ${newLives}`);
      
      setLives(newLives);
      setIsGameActive(false);
      setIsRoundComplete(true);
      setTimeExpired(true);
      
      if (newLives <= 0) {
        console.log("No lives left, ending game");
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
      } else {
        console.log(`${newLives} lives left, continuing to next round`);
        setTimeout(() => {
          startNewRound(newLives);
        }, 1000);
      }
    }
  }, [isGameActive, isRoundComplete, lives, setLives, setIsGameActive, setIsRoundComplete, setTimeExpired, setIsGameOver, startNewRound]);

  const handleImageLoaded = useCallback(() => {
    setIsImageLoaded(true);
    setIsGameActive(true);
  }, [setIsImageLoaded, setIsGameActive]);
  
  const handleImageError = useCallback(() => {
    setTimeout(() => {
      startNewRound();
    }, 2000);
  }, [startNewRound]);
  
  const handleRevealComplete = useCallback(() => {
    if (isGameActive && !isRoundComplete) {
      handleTimeUp();
    }
  }, [isGameActive, isRoundComplete, handleTimeUp]);
  
  const handleNextRound = useCallback(async () => {
    await startNewRound();
  }, [startNewRound]);
  
  const handleSkip = useCallback(() => {
    if (isGameActive) {
      const newLives = Math.max(0, lives - 1);
      console.log(`Skip: Reducing lives from ${lives} to ${newLives}`);
      
      setLives(newLives);
      setIsGameActive(false);
      setIsRoundComplete(false);
      setTimeExpired(false);
      setShowSuccessDialog(false);
      setIsCorrectGuess(false);
      
      if (newLives <= 0) {
        console.log("No lives left, ending game");
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
      } else {
        console.log(`${newLives} lives left, continuing to next round`);
        setTimeout(() => {
          startNewRound(newLives);
        }, 200);
      }
    }
  }, [isGameActive, lives, setLives, setIsGameActive, setIsRoundComplete, setTimeExpired, setShowSuccessDialog, setIsCorrectGuess, setIsGameOver, startNewRound]);
  
  const resetGame = useCallback(() => {
    resetScoreAndLives();
  }, [resetScoreAndLives]);
  
  const handleSubmitScore = useCallback((playerName: string) => {
    console.log(`Saving score for ${playerName}: ${scoreState.score}`);
    resetGame();
  }, [scoreState.score, resetGame]);

  return {
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleImageError,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
    resetGame,
    handleSubmitScore
  };
}
