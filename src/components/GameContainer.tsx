
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import Timer from './Timer';
import GameHeader from './GameHeader';
import GameFooter from './GameFooter';
import { getRandomMovie, Movie, getNextMovie } from '../utils/gameData';

const GAME_DURATION = 30000; // 30 seconds
const TOTAL_ROUNDS = 5;

const GameContainer: React.FC = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  
  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);
  
  const startNewRound = () => {
    const nextMovie = currentMovie 
      ? getNextMovie(currentMovie.id) 
      : getRandomMovie();
    
    setCurrentMovie(nextMovie);
    setIsGameActive(true);
    setIsRoundComplete(false);
    setIsCorrectGuess(false);
  };
  
  const handleTimeUp = () => {
    if (!isRoundComplete) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      toast.error("Time's up!");
      
      // Play sound effect or animation here
    }
  };
  
  const handleRevealComplete = () => {
    if (!isRoundComplete) {
      handleTimeUp();
    }
  };
  
  const handleGuess = (guess: string) => {
    if (!currentMovie || !isGameActive) return;
    
    // Very simple matching algorithm - make it case insensitive
    // In a real app, consider more sophisticated matching (e.g., Levenshtein distance)
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      // Calculate score based on how quickly they guessed
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(true);
      setScore(prev => prev + 100);
      
      toast.success("Correct answer!");
      // Add sound effects or animations here
    } else {
      toast.error("Try again!");
      // Maybe deduct points or add other effects for wrong guesses
    }
  };
  
  const handleNextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      // Game complete
      toast.success(`Game complete! Final score: ${score}`);
      
      // Reset the game
      setRound(1);
      setScore(0);
      startNewRound();
    } else {
      // Next round
      setRound(prev => prev + 1);
      startNewRound();
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 reveal-animation">Movie Mystery Reveal</h1>
        
        <GameHeader score={score} round={round} totalRounds={TOTAL_ROUNDS} />
        
        <div className="w-full flex items-center justify-between mb-4">
          <Timer 
            duration={GAME_DURATION} 
            onTimeUp={handleTimeUp} 
            isRunning={isGameActive} 
          />
          
          {currentMovie?.hint && (
            <div className="glass-panel px-3 py-1 rounded-full">
              <span className="text-xs font-medium">Hint: {currentMovie.hint}</span>
            </div>
          )}
        </div>
        
        {currentMovie && (
          <MovieImage 
            imageUrl={currentMovie.imageUrl}
            duration={GAME_DURATION}
            onRevealComplete={handleRevealComplete}
            isActive={isGameActive}
          />
        )}
        
        <div className="w-full mt-6">
          <GuessInput 
            onGuess={handleGuess}
            disabled={!isGameActive}
            correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
            isCorrect={isCorrectGuess}
            onNextRound={handleNextRound}
          />
        </div>
        
        <GameFooter />
      </div>
    </div>
  );
};

export default GameContainer;
