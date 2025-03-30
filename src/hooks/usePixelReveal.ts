import { useImageLoader } from './useImageLoader';
import { usePixelationAnimation } from './usePixelationAnimation';
import { Difficulty } from '../lib/supabase';

interface UsePixelRevealProps {
  imageUrl: string;
  duration: number;
  onRevealComplete?: () => void;
  onImageLoaded?: () => void;
  onImageError?: () => void;
  isActive: boolean;
  isPaused?: boolean;
  difficulty: Difficulty;
}

export function usePixelReveal({
  imageUrl,
  duration,
  onRevealComplete,
  onImageLoaded,
  onImageError,
  isActive,
  isPaused = false,
  difficulty
}: UsePixelRevealProps) {
  // Use the image loader hook
  const {
    imageRef,
    isLoaded,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry
  } = useImageLoader({
    imageUrl,
    onImageLoaded,
    onImageError
  });

  // Use the pixelation animation hook with isPaused prop
  const { 
    canvasRef, 
    isPaused: internalIsPaused,
    togglePause
  } = usePixelationAnimation({
    imageRef,
    duration,
    onRevealComplete,
    isActive,
    isLoaded,
    isPaused,
    difficulty
  });

  return {
    canvasRef,
    isLoaded,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry,
    isPaused: internalIsPaused,
    togglePause
  };
}
