import React from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import SuccessDialog from './SuccessDialog';
import GameLoading from './GameLoading';
import GameHeader from './GameHeader';
import { useGameState } from '../hooks/useGameState';

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
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
  } = useGameState();
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-2xl aspect-[3/5] h-full max-h-screen">
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
                    hint={currentMovie?.hint}
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
