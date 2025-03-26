
import React, { useState, useEffect, useRef } from 'react';
import ImageLoadingIndicator from './ImageLoadingIndicator';
import PixelRevealCanvas from './PixelRevealCanvas';
import MovieContentWrapper from './MovieContentWrapper';
import { createPixelationAnimation } from '../utils/pixelate';

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
  isPaused = false,
  onTogglePause
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<{ 
    start: () => void; 
    stop: () => void; 
    pause: () => void;
    resume: () => void;
    forceComplete: () => void 
  } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingProgressRef = useRef<number>(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleCanvasClick = () => {
    if (onTogglePause && isLoaded && !isLoading) {
      onTogglePause();
    }
  };

  const loadImage = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    loadingProgressRef.current = 0;
    setLoadingProgress(0);
    
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    timerRef.current = setTimeout(() => {
      if (!isLoaded) {
        setTimeoutError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    }, 15000);
    
    const progressInterval = setInterval(() => {
      if (loadingProgressRef.current < 90) {
        loadingProgressRef.current += 5;
        setLoadingProgress(loadingProgressRef.current);
      } else {
        clearInterval(progressInterval);
      }
    }, 300);
    
    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      clearInterval(progressInterval);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      loadingProgressRef.current = 100;
      setLoadingProgress(100);
      
      if (!canvasRef.current) return;
      
      const container = canvasRef.current.parentElement;
      if (container) {
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
      
      try {
        const animation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        animationRef.current = animation;
        imageRef.current = image;
        
        setIsLoaded(true);
        setIsLoading(false);
        
        if (isActive) {
          animation.start();
        } else {
          animation.forceComplete();
        }
        
        if (onImageLoaded) {
          onImageLoaded();
        }
      } catch (error) {
        console.error("Error creating animation:", error);
        setLoadError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    };
    
    image.onerror = () => {
      clearInterval(progressInterval);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      console.error("Error loading image:", imageUrl);
      setLoadError(true);
      setIsLoading(false);
      if (onImageError) onImageError();
    };
    
    image.src = imageUrl;
  };
  
  useEffect(() => {
    if (!imageUrl) return;
    
    loadImage();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [imageUrl, duration, onImageLoaded, onRevealComplete, onImageError]);
  
  useEffect(() => {
    // Don't restart the animation when only the pause state changes
    if (!animationRef.current || !isLoaded) return;
    
    if (isActive && !isPaused) {
      // Only need to resume if it was previously paused
      animationRef.current.resume();
    } else if (isActive && isPaused) {
      animationRef.current.pause();
    } else {
      animationRef.current.forceComplete();
    }
  }, [isActive, isLoaded, isPaused]);
  
  // The useEffect below is no longer needed as we handle pause/resume in the effect above
  
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !imageRef.current || !isLoaded) return;
      
      const container = canvasRef.current.parentElement;
      if (!container) return;
      
      if (Math.abs(canvasRef.current.width - container.clientWidth) > 10 || 
          Math.abs(canvasRef.current.height - container.clientHeight) > 10) {
        
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
        
        if (animationRef.current) {
          animationRef.current.stop();
          
          try {
            const animation = createPixelationAnimation(
              imageRef.current,
              canvasRef.current,
              duration,
              onRevealComplete
            );
            
            animationRef.current = animation;
            
            if (isActive) {
              animation.start();
            } else {
              animation.forceComplete();
            }
          } catch (error) {
            console.error("Error recreating animation on resize:", error);
          }
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [duration, isActive, isLoaded, onRevealComplete]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      loadImage();
    }
  };

  return (
    <div 
      className="pixel-reveal-container glass-panel no-rounded relative"
      onClick={handleCanvasClick}
    >
      <PixelRevealCanvas ref={canvasRef} />
      
      <ImageLoadingIndicator 
        isLoading={isLoading}
        progress={loadingProgress}
        error={loadError}
        timeout={timeoutError}
        onRetry={handleRetry}
      />
      
      {children && <MovieContentWrapper>{children}</MovieContentWrapper>}
      
      {isLoaded && isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="bg-black/60 p-3 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="36" 
              height="36" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieImage;
