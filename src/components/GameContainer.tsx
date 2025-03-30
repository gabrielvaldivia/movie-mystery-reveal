
import React, { useState } from 'react';
import MovieImage from './MovieImage';
import GuessInput from './GuessInput';
import SuccessDialog from './SuccessDialog';
import GameLoading from './GameLoading';
import GameHeader from './GameHeader';
import GameOverScreen from './GameOverScreen';
import StartScreen from './StartScreen';
import { useGameState } from '../hooks/useGameState';
import { useIsMobile } from '@/hooks/use-mobile';

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
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
    lives,
    maxLives,
    score,
    isGameOver,
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleImageError,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
    resetGame,
    handleSubmitScore,
    updateRemainingTime
  } = useGameState();
  
  const handleStartGame = () => {
    resetGame(); // Ensure game state is reset before starting a new game
    setShowStartScreen(false);
    setIsPaused(false); // Ensure game starts unpaused
  };
  
  const handleCloseGame = () => {
    setShowStartScreen(true);
    resetGame();
    setIsPaused(false); // Reset pause state when game closes
  };
  
  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  // Reset pause state when moving to next round or skipping
  const handleNextRoundWithReset = () => {
    setIsPaused(false);
    handleNextRound();
  };
  
  const handleSkipWithReset = () => {
    setIsPaused(false);
    handleSkip();
  };
  
  const handlePlayAgain = () => {
    resetGame();
  };
  
  if (showStartScreen) {
    return (
      <div className={`w-full ${isMobile ? 'h-full absolute inset-0 overflow-hidden' : 'h-full overflow-hidden'} flex items-center justify-center m-0 p-0`}>
        <div className={`flex flex-col items-center w-full max-w-2xl ${isMobile ? 'h-full max-h-none' : 'aspect-[3/5] h-full max-h-screen'} m-0 p-0`}>
          <StartScreen onStartGame={handleStartGame} />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${isMobile ? 'h-full absolute inset-0 overflow-hidden' : 'h-full overflow-hidden'} flex items-center justify-center m-0 p-0`}>
      <div className={`flex flex-col items-center w-full max-w-2xl ${isMobile ? 'h-full max-h-none' : 'aspect-[3/5] h-full max-h-screen'} m-0 p-0`}>
        {isLoading ? (
          <GameLoading loadingProgress={loadingProgress} />
        ) : currentMovie ? (
          <>
            {isGameOver ? (
              <GameOverScreen 
                finalScore={score}
                onPlayAgain={handlePlayAgain}
                onSubmitScore={handleSubmitScore}
              />
            ) : (
              <>
                {showSuccessDialog && !timeExpired && (
                  <SuccessDialog 
                    isOpen={showSuccessDialog}
                    movie={currentMovie}
                    onNextRound={handleNextRoundWithReset}
                    timeExpired={false}
                  />
                )}
                
                <div className="relative w-full h-full m-0 p-0 overflow-hidden">
                  <GameHeader 
                    duration={GAME_DURATION}
                    onTimeUp={handleTimeUp}
                    isRunning={isGameActive && isImageLoaded && !showSuccessDialog}
                    onSkip={handleSkipWithReset}
                    onClose={handleCloseGame}
                    isPaused={isPaused}
                    onTogglePause={handleTogglePause}
                    onTimeUpdate={updateRemainingTime}
                    lives={lives}
                    score={score}
                    maxLives={maxLives}
                  />
                  
                  <MovieImage 
                    key={imageKey}
                    imageUrl={currentMovie.imageUrl}
                    duration={GAME_DURATION}
                    onRevealComplete={handleRevealComplete}
                    isActive={isGameActive && !showSuccessDialog}
                    onImageLoaded={handleImageLoaded}
                    onImageError={handleImageError}
                    isPaused={isPaused}
                    onTogglePause={handleTogglePause}
                  >
                    <GuessInput 
                      onGuess={handleGuess}
                      disabled={!isGameActive || isLoading || !isImageLoaded}
                      correctAnswer={isRoundComplete ? currentMovie?.title : undefined}
                      isCorrect={isCorrectGuess}
                      hasIncorrectGuess={hasIncorrectGuess}
                      onNextRound={handleNextRoundWithReset}
                    />
                  </MovieImage>
                </div>
              </>
            )}
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
              onClick={handleNextRoundWithReset}
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
