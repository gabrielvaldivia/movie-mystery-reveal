
import React, { useState, useEffect } from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import Timer from './Timer';
import GameHeader from './GameHeader';
import GameFooter from './GameFooter';
import { getRandomMovie, Movie, getNextMovie, loadAllMovieImages } from '../utils/gameData';

const GAME_DURATION = 30000; // 30 seconds
const TOTAL_ROUNDS = 5;

const GameContainer: React.FC = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      try {
        await loadAllMovieImages();
        await startNewRound();
      } catch (error) {
        console.error("Error initializing game:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initGame();
  }, []);
  
  const startNewRound = async () => {
    console.log("Starting new round");
    setIsLoading(true);
    try {
      const nextMovie = currentMovie 
        ? await getNextMovie(currentMovie.id) 
        : await getRandomMovie();
      
      console.log("Next movie selected:", nextMovie.title);
      setCurrentMovie(nextMovie);
      setIsGameActive(true);
      setIsRoundComplete(false);
      setIsCorrectGuess(false);
    } catch (error) {
      console.error("Error starting new round:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTimeUp = () => {
    if (!isRoundComplete) {
      setIsGameActive(false);
      setIsRoundComplete(true);
    }
  };
  
  const handleRevealComplete = () => {
    if (!isRoundComplete) {
      handleTimeUp();
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
    }
  };
  
  const handleSkip = async () => {
    if (!isRoundComplete && isGameActive) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(false);
      
      setTimeout(async () => {
        if (round >= TOTAL_ROUNDS) {
          setRound(1);
          setScore(0);
          await startNewRound();
        } else {
          setRound(prev => prev + 1);
          await startNewRound();
        }
      }, 1000);
    }
  };
  
  const handleNextRound = async () => {
    if (round >= TOTAL_ROUNDS) {
      setRound(1);
      setScore(0);
      await startNewRound();
    } else {
      setRound(prev => prev + 1);
      await startNewRound();
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
        
        {isLoading ? (
          <div className="w-full aspect-video glass-panel flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : currentMovie ? (
          <MovieImage 
            imageUrl={currentMovie.imageUrl}
            duration={GAME_DURATION}
            onRevealComplete={handleRevealComplete}
            isActive={isGameActive}
          />
        ) : null}
        
        <div className="w-full mt-6">
          <GuessInput 
            onGuess={handleGuess}
            disabled={!isGameActive || isLoading}
            correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
            isCorrect={isCorrectGuess}
            onNextRound={handleNextRound}
            onSkip={handleSkip}
          />
        </div>
        
        <GameFooter />
      </div>
    </div>
  );
};

export default GameContainer;
