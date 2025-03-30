import React, { useState, useEffect } from "react";
import MovieImage from "./MovieImage";
import GuessInput from "./GuessInput";
import SuccessDialog from "./SuccessDialog";
import GameLoading from "./GameLoading";
import GameHeader from "./GameHeader";
import GameOverScreen from "./GameOverScreen";
import StartScreen from "./StartScreen";
import { useGameState } from "../hooks/useGameState";
import { useIsMobile } from "@/hooks/use-mobile";
import { leaderboardService } from "../services/leaderboardService";
import { LeaderboardEntry } from "../lib/supabase";

const GAME_DURATION = 30000; // 30 seconds

const GameContainer: React.FC = () => {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
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
    updateRemainingTime,
  } = useGameState();

  useEffect(() => {
    console.log("GameContainer mounted, loading scores...");
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      console.log("Loading scores from Supabase...");
      const topScores = await leaderboardService.getTopScores();
      console.log("Scores loaded:", topScores);
      setScores(topScores);
    } catch (error) {
      console.error("Error loading scores:", error);
    }
  };

  const handleStartGame = () => {
    resetGame();
    setShowStartScreen(false);
    setIsPaused(false);
  };

  const handleCloseGame = () => {
    setShowStartScreen(true);
    resetGame();
    setIsPaused(false);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

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

  const handleSaveScore = async (playerName: string) => {
    try {
      console.log("Saving score for player:", playerName, "score:", score);
      await leaderboardService.saveScore(playerName, score);
      console.log("Score saved, reloading scores...");
      await loadScores(); // Reload scores after saving
      handleSubmitScore(playerName);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (showStartScreen) {
    return (
      <div
        className={`w-full ${
          isMobile
            ? "h-full absolute inset-0 overflow-hidden"
            : "h-full overflow-hidden"
        } flex items-center justify-center m-0 p-0`}
      >
        <div
          className={`flex flex-col items-center w-full ${
            isMobile ? "h-full max-h-none" : "aspect-[3/5] h-full max-h-screen"
          } m-0 p-0 bg-[#1A2336]`}
        >
          <StartScreen onStartGame={handleStartGame} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${
        isMobile
          ? "h-full absolute inset-0 overflow-hidden"
          : "h-full overflow-hidden"
      } flex items-center justify-center m-0 p-0 bg-[#1A2336]`}
    >
      <div
        className={`flex flex-col items-center w-full max-w-2xl ${
          isMobile ? "h-full max-h-none" : "aspect-[3/5] h-full max-h-screen"
        } m-0 p-0`}
      >
        {isLoading ? (
          <GameLoading loadingProgress={loadingProgress} />
        ) : isGameOver ? (
          <GameOverScreen
            finalScore={score}
            onPlayAgain={handlePlayAgain}
            onSubmitScore={handleSaveScore}
            scores={scores}
          />
        ) : (
          <>
            <GameHeader
              duration={GAME_DURATION}
              onTimeUp={handleTimeUp}
              isRunning={isGameActive}
              onSkip={handleSkipWithReset}
              onClose={handleCloseGame}
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              onTimeUpdate={updateRemainingTime}
              lives={lives}
              score={score}
              maxLives={maxLives}
            />

            <div className="relative flex-1 w-full">
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
                  correctAnswer={
                    isRoundComplete ? currentMovie?.title : undefined
                  }
                  isCorrect={isCorrectGuess}
                  hasIncorrectGuess={hasIncorrectGuess}
                  onNextRound={handleNextRoundWithReset}
                />
              </MovieImage>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameContainer;
