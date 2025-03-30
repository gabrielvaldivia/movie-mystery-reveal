
import { useState } from 'react';

export interface UseGameScoreResult {
  score: number;
  lives: number;
  maxLives: number;
  isGameOver: boolean;
  remainingTimeMs: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  updateRemainingTime: (timeMs: number) => void;
  resetScoreAndLives: () => void;
}

export function useGameScore(initialLives: number = 10): UseGameScoreResult {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [isGameOver, setIsGameOver] = useState(false);
  const [remainingTimeMs, setRemainingTimeMs] = useState(0);
  
  const updateRemainingTime = (timeMs: number) => {
    setRemainingTimeMs(timeMs);
  };
  
  const resetScoreAndLives = () => {
    setScore(0);
    setLives(initialLives);
    setIsGameOver(false);
  };

  return {
    score,
    lives,
    maxLives: initialLives,
    isGameOver,
    remainingTimeMs,
    setScore,
    setLives,
    setIsGameOver,
    updateRemainingTime,
    resetScoreAndLives
  };
}
