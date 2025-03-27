
import React, { useState } from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import SuccessDialog from './SuccessDialog';
import GameLoading from './GameLoading';
import GameHeader from './GameHeader';
import StartScreen from './StartScreen';
import { useGameState } from '../hooks/useGameState';
import { useIsMobile } from '@/hooks/use-mobile';

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const isMobile = useIsMobile();
  const {
    currentMovie,
    isGameActive,
    isLoading,
    isImageLoaded,
    imageKey,
    showSuccessDialog,
    loadingProgress,
    timeExpired,
    hasIncorrectGuess,
    isCorrectGuess,
    isRoundComplete,
    imageLoadError,
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleImageError,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
    resetGame
  } = useGameState();
  
  const handleStartGame = () => {
    resetGame(); // Ensure game state is reset before starting a new game
    setShowStartScreen(false);
  };
  
  const handleCloseGame = () => {
    setShowStartScreen(true);
    resetGame();
  };
  
  if (showStartScreen) {
    return (
      <div className={`w-full ${isMobile ? 'h-full absolute inset-0' : 'h-full'} flex items-center justify-center`}>
        <div className={`flex flex-col items-center w-full max-w-2xl ${isMobile ? 'h-full max-h-none' : 'aspect-[3/5] h-full max-h-screen'}`}>
          <StartScreen onStartGame={handleStartGame} />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${isMobile ? 'h-full absolute inset-0' : 'h-full'} flex items-center justify-center`}>
      <div className={`flex flex-col items-center w-full max-w-2xl ${isMobile ? 'h-full max-h-none' : 'aspect-[3/5] h-full max-h-screen'}`}>
        {isLoading ? (
          <GameLoading loadingProgress={loadingProgress} />
        ) : currentMovie ? (
          <>
            {!showSuccessDialog && (
              <div className="relative w-full h-full">
                <GameHeader 
                  duration={GAME_DURATION}
                  onTimeUp={handleTimeUp}
                  isRunning={isGameActive && isImageLoaded && !showSuccessDialog}
                  onSkip={handleSkip}
                  onClose={handleCloseGame}
                />
                
                <MovieImage 
                  key={imageKey}
                  imageUrl={currentMovie.imageUrl}
                  duration={GAME_DURATION}
                  onRevealComplete={handleRevealComplete}
                  isActive={isGameActive && !showSuccessDialog}
                  onImageLoaded={handleImageLoaded}
                  onImageError={handleImageError}
                >
                  <GuessInput 
                    onGuess={handleGuess}
                    disabled={!isGameActive || isLoading || !isImageLoaded}
                    correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
                    isCorrect={isCorrectGuess}
                    hasIncorrectGuess={hasIncorrectGuess}
                    onNextRound={handleNextRound}
                  />
                </MovieImage>
              </div>
            )}
            
            <SuccessDialog 
              isOpen={showSuccessDialog}
              movie={currentMovie}
              onNextRound={handleNextRound}
              timeExpired={timeExpired}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-card text-card-foreground rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {imageLoadError ? "Error Loading Movies" : "No Movies Available"}
            </h2>
            <p className="text-center text-muted-foreground mb-6 px-4">
              {imageLoadError 
                ? "There was a problem loading the movie images. Please try again later."
                : "There are no movies available to play with. Please check back later."
              }
            </p>
            <button 
              onClick={handleNextRound}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameContainer;
