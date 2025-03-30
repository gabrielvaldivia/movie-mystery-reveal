import React from "react";
import ImageLoadingIndicator from "./ImageLoadingIndicator";
import PixelRevealCanvas from "./PixelRevealCanvas";
import MovieContentWrapper from "./MovieContentWrapper";
import { usePixelReveal } from "../hooks/usePixelReveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Difficulty } from "@/lib/supabase";

interface MovieImageProps {
  imageUrl: string;
  duration: number; // in milliseconds
  onRevealComplete?: () => void;
  isActive: boolean;
  children?: React.ReactNode;
  onImageLoaded?: () => void;
  onImageError?: () => void;
  onRetry?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  difficulty: Difficulty;
  isCorrectGuess?: boolean;
}

const MovieImage: React.FC<MovieImageProps> = ({
  imageUrl,
  duration,
  onRevealComplete,
  isActive,
  children,
  onImageLoaded,
  onImageError,
  onRetry,
  isPaused,
  onTogglePause,
  difficulty,
  isCorrectGuess = false,
}) => {
  const isMobile = useIsMobile();
  const {
    canvasRef,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry,
    isPaused: internalIsPaused,
    togglePause: internalTogglePause,
  } = usePixelReveal({
    imageUrl,
    duration,
    onRevealComplete: isCorrectGuess ? undefined : onRevealComplete,
    onImageLoaded,
    onImageError,
    isActive,
    isPaused,
    difficulty,
  });

  const handleRetryClick = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleRetry();
    }
  };

  // Use external pause state/functions if provided, otherwise use internal ones
  const effectivePause = isPaused !== undefined ? isPaused : internalIsPaused;
  const effectiveTogglePause = onTogglePause || internalTogglePause;

  return (
    <div className="pixel-reveal-container relative w-full h-full p-0 m-0 overflow-hidden">
      <PixelRevealCanvas ref={canvasRef} />

      <ImageLoadingIndicator
        isLoading={isLoading}
        progress={loadingProgress}
        error={loadError}
        timeout={timeoutError}
        onRetry={handleRetryClick}
      />

      {children && <MovieContentWrapper>{children}</MovieContentWrapper>}
    </div>
  );
};

export default MovieImage;
