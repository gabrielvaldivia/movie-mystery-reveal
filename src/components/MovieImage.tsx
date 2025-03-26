
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';
import ImageLoadingIndicator from './ImageLoadingIndicator';
import { retryMovieImage } from '../utils/services/movieImageService';
import { Movie } from '../utils/types/movieTypes';

interface MovieImageProps {
  imageUrl: string;
  movie?: Movie; // Add the movie object for better retry handling
  duration: number; // in milliseconds
  onRevealComplete?: () => void;
  isActive: boolean;
  children?: React.ReactNode;
  onImageLoaded?: () => void;
  onImageUrlChanged?: (newUrl: string) => void;
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  movie,
  duration, 
  onRevealComplete,
  isActive,
  children,
  onImageLoaded,
  onImageUrlChanged
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const timeoutRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
    forceComplete: () => void;
  } | null>(null);

  // Function to clean up timers and listeners
  const cleanup = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (animation) {
      animation.stop();
    }
    
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
    }
  };

  const loadImage = useCallback((url: string = currentImageUrl) => {
    // Reset states
    setIsLoaded(false);
    setLoadProgress(0);
    setLoadError(false);
    setLoadTimeout(false);
    setAnimation(null);
    
    // Clean up first
    cleanup();
    
    console.log("Attempting to load image:", url);
    
    // Create a new image object
    const image = new Image();
    // Add cache-busting parameter
    image.src = `${url}?t=${Date.now()}`;
    image.crossOrigin = "anonymous";
    imageRef.current = image;

    // Set a timeout for image loading (10 seconds)
    timeoutRef.current = window.setTimeout(() => {
      setLoadTimeout(true);
      console.log("Image loading timed out:", url);
    }, 10000);

    // Simulate progress
    progressIntervalRef.current = window.setInterval(() => {
      setLoadProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 200);

    // Handle successful image load
    image.onload = () => {
      cleanup();
      
      console.log("Image loaded successfully:", url);
      setLoadProgress(100);
      setIsLoaded(true);
      
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
        
        try {
          const pixelAnimation = createPixelationAnimation(
            image,
            canvasRef.current,
            duration,
            onRevealComplete
          );
          
          setAnimation(pixelAnimation);
          
          // Call the callback
          if (onImageLoaded) {
            onImageLoaded();
          }
        } catch (error) {
          console.error("Error creating animation:", error);
          setLoadError(true);
        }
      }
    };

    // Handle image load error
    image.onerror = (error) => {
      cleanup();
      setLoadError(true);
      console.error("Error loading image:", url, error);
    };
  }, [currentImageUrl, duration, onRevealComplete, onImageLoaded]);

  // Handle retry with potentially new image URL
  const handleRetry = useCallback(async () => {
    if (movie) {
      try {
        console.log("Retrying with movie object:", movie.title);
        const newUrl = await retryMovieImage(movie);
        console.log("Got new URL:", newUrl);
        
        // Only update if URL changed
        if (newUrl !== currentImageUrl) {
          setCurrentImageUrl(newUrl);
          if (onImageUrlChanged) {
            onImageUrlChanged(newUrl);
          }
        }
        
        // Always attempt to load the image again
        loadImage(newUrl);
      } catch (error) {
        console.error("Error during retry:", error);
        // Still try to reload with current URL as fallback
        loadImage();
      }
    } else {
      // If no movie object, just retry with current URL
      loadImage();
    }
  }, [movie, currentImageUrl, loadImage, onImageUrlChanged]);

  // Load image when URL changes
  useEffect(() => {
    if (imageUrl !== currentImageUrl) {
      setCurrentImageUrl(imageUrl);
    }
    loadImage(imageUrl);
    
    // Clean up on unmount or URL change
    return cleanup;
  }, [imageUrl, loadImage]);

  // Handle animation state based on isActive
  useEffect(() => {
    if (animation && isLoaded) {
      if (isActive) {
        animation.start();
      } else {
        animation.stop();
        animation.forceComplete();
      }
    }
  }, [isActive, animation, isLoaded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageRef.current && isLoaded) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          // Only recreate if significant size change
          if (Math.abs(canvasRef.current.width - containerWidth) > 10 || 
              Math.abs(canvasRef.current.height - containerHeight) > 10) {
            
            canvasRef.current.width = containerWidth;
            canvasRef.current.height = containerHeight;
            
            if (animation) {
              animation.stop();
              
              try {
                const newAnimation = createPixelationAnimation(
                  imageRef.current,
                  canvasRef.current,
                  duration,
                  onRevealComplete
                );
                
                setAnimation(newAnimation);
                
                if (isActive) {
                  newAnimation.start();
                } else {
                  newAnimation.forceComplete();
                }
              } catch (error) {
                console.error("Error recreating animation on resize:", error);
              }
            }
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animation, duration, onRevealComplete, isActive, isLoaded]);

  return (
    <div className="pixel-reveal-container glass-panel no-rounded relative">
      {/* Canvas for the pixelation effect */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      
      {/* Simplified loading indicator component */}
      <ImageLoadingIndicator 
        isLoading={!isLoaded}
        progress={loadProgress}
        error={loadError}
        timeout={loadTimeout}
        onRetry={handleRetry}
      />
      
      {/* Children (like buttons or UI controls) */}
      {children && (
        <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default MovieImage;
