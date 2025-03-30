
import { useState, useCallback } from 'react';
import { Movie } from '../utils/types/movieTypes';
import { getRandomMovie, getNextMovie } from '../utils/gameData';

export interface UseGameRoundResult {
  currentMovie: Movie | null;
  isGameActive: boolean;
  isRoundComplete: boolean;
  isCorrectGuess: boolean;
  hasIncorrectGuess: boolean;
  isImageLoaded: boolean;
  imageKey: number;
  showSuccessDialog: boolean;
  timeExpired: boolean;
  isLoading: boolean;
  startNewRound: (livesOverride?: number) => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRoundComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeExpired: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCorrectGuess: React.Dispatch<React.SetStateAction<boolean>>;
  setHasIncorrectGuess: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGameRound(
  lives: number,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  setLives: React.Dispatch<React.SetStateAction<number>>
): UseGameRoundResult {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  
  const startNewRound = useCallback(async (livesOverride?: number) => {
    console.log("Starting new round with lives:", livesOverride !== undefined ? livesOverride : lives);
    
    const currentLivesValue = livesOverride !== undefined ? livesOverride : lives;
    
    if (currentLivesValue <= 0) {
      console.log("No lives left, game over");
      setIsGameOver(true);
      return;
    }
    
    if (livesOverride !== undefined) {
      console.log("Setting lives explicitly to:", livesOverride);
      setLives(livesOverride);
    }
    
    setIsLoading(true);
    setIsImageLoaded(false);
    setShowSuccessDialog(false);
    setTimeExpired(false);
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
      
      // Give UI time to update before finishing loading
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
    } catch (error) {
      console.error("Error starting new round:", error);
      setIsLoading(false);
    }
  }, [currentMovie, lives, setIsGameOver, setLives]);

  return {
    currentMovie,
    isGameActive,
    isRoundComplete,
    isCorrectGuess,
    hasIncorrectGuess,
    isImageLoaded,
    imageKey,
    showSuccessDialog,
    timeExpired,
    isLoading,
    startNewRound,
    setIsLoading,
    setIsImageLoaded,
    setIsGameActive,
    setIsRoundComplete,
    setShowSuccessDialog,
    setTimeExpired,
    setIsCorrectGuess,
    setHasIncorrectGuess
  };
}
