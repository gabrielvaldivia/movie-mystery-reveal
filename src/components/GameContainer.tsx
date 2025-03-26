import React, { useState, useEffect } from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import Timer from './Timer';
import SuccessDialog from './SuccessDialog';
import { getRandomMovie, Movie, getNextMovie, loadAllMovieImages } from '../utils/gameData';
import { Button } from './ui/button';
import { SkipForward } from 'lucide-react';

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Add a key to force re-mounting
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
  
  const handleImageLoaded = () => {
    setIsImageLoaded(true);
    // Now that the image is loaded, we can start the game
    setIsGameActive(true);
  };
  
  const handleTimeUp = () => {
    if (!isRoundComplete) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      setTimeExpired(true);
      setShowSuccessDialog(true);
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
      setShowSuccessDialog(true);
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
  
  const handleSkip = async () => {
    if (isGameActive) {
      setIsGameActive(false);
      setIsRoundComplete(true);
      await startNewRound();
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-2xl aspect-[3/5] h-full max-h-[85vh]">
        {isLoading ? (
          <div className="w-full h-full glass-panel flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-opacity-20 absolute"></div>
              <div 
                className="w-16 h-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent absolute animate-spin"
                style={{ animationDuration: '1.5s' }}
              ></div>
            </div>
            <div className="w-3/4 max-w-xs">
              <div className="h-2 bg-secondary-foreground/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Loading game assets...
              </p>
            </div>
          </div>
        ) : currentMovie ? (
          <>
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-2">
                <div className="w-full mr-2">
                  <Timer 
                    duration={GAME_DURATION} 
                    onTimeUp={handleTimeUp} 
                    isRunning={isGameActive && isImageLoaded && !showSuccessDialog} 
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
                key={imageKey}
                imageUrl={currentMovie.imageUrl}
                duration={GAME_DURATION}
                onRevealComplete={handleRevealComplete}
                isActive={isGameActive && !showSuccessDialog}
                onImageLoaded={handleImageLoaded}
              >
                {!showSuccessDialog && (
                  <GuessInput 
                    onGuess={handleGuess}
                    disabled={!isGameActive || isLoading || !isImageLoaded}
                    correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
                    isCorrect={isCorrectGuess}
                    hasIncorrectGuess={hasIncorrectGuess}
                    onNextRound={handleNextRound}
                    hint={currentMovie?.hint}
                  />
                )}
              </MovieImage>
            </div>
            
            <SuccessDialog 
              isOpen={showSuccessDialog}
              movie={currentMovie}
              onNextRound={handleNextRound}
              timeExpired={timeExpired}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GameContainer;
