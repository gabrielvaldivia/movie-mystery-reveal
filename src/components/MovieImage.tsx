
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
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  duration, 
  onRevealComplete,
  isActive,
  children,
  onImageLoaded,
  onImageError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<{ start: () => void; stop: () => void; forceComplete: () => void } | null>(null);

  // Effect to handle image loading
  useEffect(() => {
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    
    // Clean up any previous animation
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
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
      console.error("Error loading image:", imageUrl);
      setLoadError(true);
      setIsLoading(false);
      if (onImageError) onImageError();
    };
    
    // Set the image source
    image.src = imageUrl;
    
    // Cleanup function
    return () => {
      image.onload = null;
      image.onerror = null;
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [imageUrl, duration, isActive, onImageLoaded, onRevealComplete, onImageError]);
  
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

  return (
    <div className="pixel-reveal-container glass-panel no-rounded relative">
      {/* Canvas for the pixelation effect */}
      <PixelRevealCanvas ref={canvasRef} />
      
      {/* Loading indicator component */}
      <ImageLoadingIndicator 
        isLoading={isLoading}
        progress={isLoading ? 50 : 100}
        error={loadError}
        timeout={false}
        onRetry={() => {}}
      />
      
      {/* Children (like buttons or UI controls) */}
      {children && <MovieContentWrapper>{children}</MovieContentWrapper>}
    </div>
  );
};

export default MovieImage;
