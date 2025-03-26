
import { useImageLoader } from './useImageLoader';
import { usePixelationAnimation } from './usePixelationAnimation';

interface UsePixelRevealProps {
  imageUrl: string;
  duration: number;
  onRevealComplete?: () => void;
  onImageLoaded?: () => void;
  onImageError?: () => void;
  isActive: boolean;
}

export function usePixelReveal({
  imageUrl,
  duration,
  onRevealComplete,
  onImageLoaded,
  onImageError,
  isActive
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
  const { canvasRef } = usePixelationAnimation({
    imageRef,
    duration,
    onRevealComplete,
    isActive,
    isLoaded
  });

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
