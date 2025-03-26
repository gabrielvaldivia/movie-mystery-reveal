
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
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  duration, 
  onRevealComplete,
  isActive,
  children,
  onImageLoaded,
  onImageError,
  onRetry
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<{ start: () => void; stop: () => void; forceComplete: () => void } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingProgressRef = useRef<number>(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadImage = () => {
    // Clear previous state
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    loadingProgressRef.current = 0;
    setLoadingProgress(0);
    
    // Clean up any previous animation and timer
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Set a timeout to detect if image loading takes too long
    timerRef.current = setTimeout(() => {
      if (!isLoaded) {
        setTimeoutError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    }, 15000); // 15 seconds timeout
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (loadingProgressRef.current < 90) {
        loadingProgressRef.current += 5;
        setLoadingProgress(loadingProgressRef.current);
      } else {
        clearInterval(progressInterval);
      }
    }, 300);
    
    // Create a new image element
    const image = new Image();
    // Use crossOrigin anonymous to avoid CORS issues when drawing to canvas
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      // Clear intervals and timeouts
      clearInterval(progressInterval);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      loadingProgressRef.current = 100;
      setLoadingProgress(100);
      
      if (!canvasRef.current) return;
      
      // Set up canvas dimensions
      const container = canvasRef.current.parentElement;
      if (container) {
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
      
      // Create the pixelation animation
      try {
        const animation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        animationRef.current = animation;
        imageRef.current = image;
        
        // Show the image
        setIsLoaded(true);
        setIsLoading(false);
        
        // Start or complete the animation based on isActive
        if (isActive) {
          animation.start();
        } else {
          animation.forceComplete();
        }
        
        // Call the onImageLoaded callback
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
      
      console.warn("Failed to load image:", imageUrl);
      setLoadError(true);
      setIsLoading(false);
      if (onImageError) onImageError();
    };
    
    // Add a specific attribute to reduce console noise about multiple renderings
    image.setAttribute('willReadFrequently', 'true');
    
    // Set the image source
    image.src = imageUrl;
  };
  
  // Effect to handle image loading
  useEffect(() => {
    if (!imageUrl) return;
    
    loadImage();
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [imageUrl, duration]);
  
  // Handle isActive changes
  useEffect(() => {
    if (!animationRef.current || !isLoaded) return;
    
    if (isActive) {
      animationRef.current.start();
    } else {
      animationRef.current.stop();
      animationRef.current.forceComplete();
    }
  }, [isActive, isLoaded]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !imageRef.current || !isLoaded) return;
      
      const container = canvasRef.current.parentElement;
      if (!container) return;
      
      // Only update if there's a significant size change
      if (Math.abs(canvasRef.current.width - container.clientWidth) > 10 || 
          Math.abs(canvasRef.current.height - container.clientHeight) > 10) {
        
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
        
        // Recreate animation
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
    <div className="pixel-reveal-container glass-panel no-rounded relative">
      {/* Canvas for the pixelation effect */}
      <PixelRevealCanvas ref={canvasRef} />
      
      {/* Loading indicator component */}
      <ImageLoadingIndicator 
        isLoading={isLoading}
        progress={loadingProgress}
        error={loadError}
        timeout={timeoutError}
        onRetry={handleRetry}
      />
      
      {/* Children (like buttons or UI controls) */}
      {children && <MovieContentWrapper>{children}</MovieContentWrapper>}
    </div>
  );
};

export default MovieImage;
