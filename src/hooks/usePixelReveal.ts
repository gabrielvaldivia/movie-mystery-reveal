
import { useImageLoader } from './useImageLoader';
import { usePixelationAnimation } from './usePixelationAnimation';

interface UsePixelRevealProps {
  imageUrl: string;
  duration: number;
  onRevealComplete?: () => void;
  onImageLoaded?: () => void;
  onImageError?: () => void;
  isActive: boolean;
  isPaused?: boolean;
}

export function usePixelReveal({
  imageUrl,
  duration,
  onRevealComplete,
  onImageLoaded,
  onImageError,
  isActive,
  isPaused = false
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

  // Use the pixelation animation hook
  const { canvasRef, pauseAnimation, resumeAnimation } = usePixelationAnimation({
    imageRef,
    duration,
    onRevealComplete,
    isActive,
    isLoaded
  });
  
  // Handle pause/resume
  if (isPaused) {
    pauseAnimation();
  } else if (isActive && isLoaded) {
    resumeAnimation();
  }

  return {
    canvasRef,
    isLoaded,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry
  };
}
