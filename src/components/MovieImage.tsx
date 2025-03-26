
import React, { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';
import { Skeleton } from './ui/skeleton';

interface MovieImageProps {
  imageUrl: string;
  duration: number; // in milliseconds
  onRevealComplete?: () => void;
  isActive: boolean;
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  duration, 
  onRevealComplete,
  isActive
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
  } | null>(null);

  // Set up canvas and image when component mounts or image URL changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    const image = new Image();
    
    // Always use fallback images for TMDB since they're consistently failing
    const effectiveUrl = imageUrl.includes('image.tmdb.org') 
      ? `https://source.unsplash.com/random/800x450/?movie,cinema,${encodeURIComponent(new Date().getTime().toString())}` 
      : imageUrl;
    
    image.crossOrigin = "anonymous";
    imageRef.current = image;
    
    const handleLoad = () => {
      console.log("Image loaded successfully:", effectiveUrl);
      setIsLoaded(true);
      setHasError(false);
      
      if (canvasRef.current) {
        // Match canvas dimensions to container while maintaining aspect ratio
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          canvasRef.current.width = containerWidth;
          canvasRef.current.height = (containerWidth / image.width) * image.height;
        }
        
        // Create and store animation controller
        const pixelAnimation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        setAnimation(pixelAnimation);
      }
    };
    
    const handleError = () => {
      console.error("Failed to load image:", effectiveUrl);
      setHasError(true);
      setIsLoaded(false);
      
      // Always try a unique fallback URL to prevent caching issues
      const fallbackUrl = `https://source.unsplash.com/random/800x450/?film,movie,${encodeURIComponent(new Date().getTime().toString())}`;
      console.log("Trying fallback image:", fallbackUrl);
      image.src = fallbackUrl;
    };
    
    image.onload = handleLoad;
    image.onerror = handleError;
    
    // Set image source after setting up event handlers
    image.src = effectiveUrl;

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [imageUrl, duration, onRevealComplete]);

  // Start or stop animation based on isActive prop
  useEffect(() => {
    if (animation && isLoaded) {
      if (isActive) {
        animation.start();
      } else {
        animation.stop();
      }
    }
  }, [isActive, animation, isLoaded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const oldWidth = canvasRef.current.width;
          const containerWidth = container.clientWidth;
          
          if (Math.abs(oldWidth - containerWidth) > 10) {
            // Only resize if the width difference is significant
            canvasRef.current.width = containerWidth;
            canvasRef.current.height = (containerWidth / imageRef.current.width) * imageRef.current.height;
            
            // Reapply current pixelation level after resize
            if (animation) {
              const currentLevel = animation.getCurrentLevel();
              animation.stop();
              
              if (isActive) {
                // Restart animation with new dimensions
                const newAnimation = createPixelationAnimation(
                  imageRef.current,
                  canvasRef.current,
                  duration,
                  onRevealComplete
                );
                setAnimation(newAnimation);
                newAnimation.start();
              }
            }
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animation, duration, onRevealComplete, isActive]);

  return (
    <div className="pixel-reveal-container glass-panel rounded-md overflow-hidden relative">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/50 text-center p-4">
          <span className="text-muted-foreground">Loading movie image...</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="shine-effect"></div>
    </div>
  );
};

export default MovieImage;
