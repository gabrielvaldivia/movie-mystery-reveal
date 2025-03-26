
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
    handleGuess,
    handleTimeUp,
    handleImageLoaded,
    handleRevealComplete,
    handleNextRound,
    handleSkip,
  } = useGameState();
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {showSuccessDialog ? (
        <SuccessDialog 
          isOpen={showSuccessDialog}
          movie={currentMovie}
          onNextRound={handleNextRound}
          timeExpired={timeExpired}
        />
      ) : (
        <div className="flex flex-col items-center w-full max-w-2xl aspect-[3/5] h-full max-h-[85vh]">
          {isLoading ? (
            <GameLoading loadingProgress={loadingProgress} />
          ) : currentMovie ? (
            <>
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
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
