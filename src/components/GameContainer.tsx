
import React, { useState, useEffect } from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import Timer from './Timer';
import { getRandomMovie, Movie, getNextMovie, loadAllMovieImages } from '../utils/gameData';

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false);
  
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
    setIsLoading(true);
    try {
      const nextMovie = currentMovie 
        ? await getNextMovie(currentMovie.id) 
        : await getRandomMovie();
      
      setCurrentMovie(nextMovie);
      setIsGameActive(true);
      setIsRoundComplete(false);
      setIsCorrectGuess(false);
      setHasIncorrectGuess(false);
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
    } else {
      setHasIncorrectGuess(true);
      setTimeout(() => {
        setHasIncorrectGuess(false);
      }, 1000);
    }
  };
  
  const handleNextRound = async () => {
    setScore(0);
    await startNewRound();
  };
  
  return (
    <div className="w-full h-full mx-auto">
      <div className="flex flex-col items-center h-full">
        {isLoading ? (
          <div className="w-full h-[85vh] glass-panel flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : currentMovie ? (
          <div className="relative w-full">
            <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2">
              <Timer 
                duration={GAME_DURATION} 
                onTimeUp={handleTimeUp} 
                isRunning={isGameActive} 
              />
            </div>
            <MovieImage 
              imageUrl={currentMovie.imageUrl}
              duration={GAME_DURATION}
              onRevealComplete={handleRevealComplete}
              isActive={isGameActive}
            >
              <GuessInput 
                onGuess={handleGuess}
                disabled={!isGameActive || isLoading}
                correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
                isCorrect={isCorrectGuess}
                hasIncorrectGuess={hasIncorrectGuess}
                onNextRound={handleNextRound}
                hint={currentMovie?.hint}
              />
            </MovieImage>
            {isCorrectGuess && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in rounded-lg">
                <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
                  <h3 className="font-bold text-xl mb-2 text-primary">Correct!</h3>
                  <p className="text-gray-700">{currentMovie.title}</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GameContainer;
