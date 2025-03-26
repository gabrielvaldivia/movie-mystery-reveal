
import React from 'react';
import { useImageReveal } from '../hooks/useImageReveal';
import ImageLoadingIndicator from './ImageLoadingIndicator';
import PixelRevealCanvas from './PixelRevealCanvas';
import MovieContentWrapper from './MovieContentWrapper';

interface MovieImageProps {
  imageUrl: string;
  duration: number; // in milliseconds
  onRevealComplete?: () => void;
  isActive: boolean;
  children?: React.ReactNode;
  onImageLoaded?: () => void;
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  duration, 
  onRevealComplete,
  isActive,
  children,
  onImageLoaded
}) => {
  const {
    canvasRef,
    isLoaded,
    loadProgress,
    loadError,
    loadTimeout,
    loadImage
  } = useImageReveal({
    imageUrl,
    duration,
    onRevealComplete,
    isActive,
    onImageLoaded
  });

  return (
    <div className="pixel-reveal-container glass-panel no-rounded relative">
      {/* Canvas for the pixelation effect */}
      <PixelRevealCanvas ref={canvasRef} />
      
      {/* Loading indicator component */}
      <ImageLoadingIndicator 
        isLoading={!isLoaded}
        progress={loadProgress}
        error={loadError}
        timeout={loadTimeout}
        onRetry={loadImage}
      />
      
      {/* Children (like buttons or UI controls) */}
      {children && <MovieContentWrapper>{children}</MovieContentWrapper>}
    </div>
  );
};

export default MovieImage;
