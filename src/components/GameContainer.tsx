
import React, { useState, useEffect } from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import Timer from './Timer';
import { getRandomMovie, Movie, getNextMovie, loadAllMovieImages } from '../utils/gameData';
import { Button } from './ui/button';
import { SkipForward } from 'lucide-react';
import CorrectGuessDialog from './CorrectGuessDialog';

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
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
      setShowDialog(false);
      setTimeElapsed(0);
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

  const handleTimeUpdate = (elapsed: number) => {
    setTimeElapsed(elapsed);
  };
  
  const handleGuess = (guess: string) => {
    if (!currentMovie || !isGameActive) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTitle;
    
    if (isCorrect) {
      // Calculate score based on time remaining
      const timeRemaining = GAME_DURATION - timeElapsed;
      const calculatedScore = Math.max(Math.floor((timeRemaining / GAME_DURATION) * 1000), 100);
      
      setIsGameActive(false);
      setIsRoundComplete(true);
      setIsCorrectGuess(true);
      setRoundScore(calculatedScore);
      setScore(prev => prev + calculatedScore);
      setShowDialog(true);
    } else {
      setHasIncorrectGuess(true);
      setTimeout(() => {
        setHasIncorrectGuess(false);
      }, 1000);
    }
  };
  
  const handleNextRound = async () => {
    await startNewRound();
  };
  
  const handleSkip = async () => {
    if (isGameActive) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      await startNewRound();
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-2xl aspect-[3/5] h-full max-h-[85vh]">
        {isLoading ? (
          <div className="w-full h-full glass-panel flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : currentMovie ? (
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-2">
              <div className="w-full mr-2">
                <Timer 
                  duration={GAME_DURATION} 
                  onTimeUp={handleTimeUp} 
                  isRunning={isGameActive}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSkip}
                className="bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Skip this movie"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <MovieImage 
              imageUrl={currentMovie.imageUrl}
              duration={GAME_DURATION}
              onRevealComplete={handleRevealComplete}
              isActive={isGameActive}
            >
              {!showDialog && (
                <GuessInput 
                  onGuess={handleGuess}
                  disabled={!isGameActive || isLoading}
                  correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
                  isCorrect={isCorrectGuess}
                  hasIncorrectGuess={hasIncorrectGuess}
                  onNextRound={handleNextRound}
                  hint={currentMovie?.hint}
                />
              )}
            </MovieImage>
          </div>
        ) : null}
      </div>

      <CorrectGuessDialog
        open={showDialog}
        movie={currentMovie}
        score={roundScore}
        onClose={handleCloseDialog}
        onNextMovie={handleNextRound}
      />
    </div>
  );
};

export default GameContainer;
