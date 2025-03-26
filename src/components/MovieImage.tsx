
import React from 'react';
import ImageLoadingIndicator from './ImageLoadingIndicator';
import PixelRevealCanvas from './PixelRevealCanvas';
import MovieContentWrapper from './MovieContentWrapper';
import { usePixelReveal } from '../hooks/usePixelReveal';

interface MovieImageProps {
  imageUrl: string;
  duration: number; // in milliseconds
  onRevealComplete?: () => void;
  isActive: boolean;
  isPaused?: boolean;
  children?: React.ReactNode;
  onImageLoaded?: () => void;
  onImageError?: () => void;
  onRetry?: () => void;
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  duration, 
  onRevealComplete,
  isActive,
  isPaused = false,
  children,
  onImageLoaded,
  onImageError,
  onRetry
}) => {
  const {
    canvasRef,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry
  } = usePixelReveal({
    imageUrl,
    duration,
    onRevealComplete,
    onImageLoaded,
    onImageError,
    isActive,
    isPaused
  });

  const handleRetryClick = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleRetry();
    }
  };

  return (
    <div className="pixel-reveal-container glass-panel no-rounded relative">
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
