
import React, { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';

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

  // Helper function to create a proxied URL to avoid CORS issues
  const getProxiedImageUrl = (url: string): string => {
    // Some movies might have relative URLs
    if (url.startsWith('/')) {
      return `https://image.tmdb.org/t/p/w780${url}`;
    }
    
    // Use a CORS proxy service if not already using one
    if (url.includes('image.tmdb.org') && !url.includes('cors-anywhere')) {
      // Using cors-anywhere proxy (note: this is for development purposes only)
      return `https://cors-anywhere.herokuapp.com/${url}`;
    }
    
    return url;
  };

  // Set up canvas and image when component mounts or image URL changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    // Create a new image element
    const image = new Image();
    
    // Set crossOrigin before setting the src
    image.crossOrigin = "anonymous";
    
    // Handle successful load
    image.onload = () => {
      console.log(`Image loaded successfully: ${imageUrl}`);
      setIsLoaded(true);
      setHasError(false);
      imageRef.current = image;
      
      if (canvasRef.current) {
        // Match canvas dimensions to container while maintaining aspect ratio
        const container = canvasRef.current.parentElement;
        if (container) {
          // For backdrops (screenshots), use the full container width
          const containerWidth = container.clientWidth;
          canvasRef.current.width = containerWidth;
          canvasRef.current.height = (containerWidth * 9) / 16; // Force 16:9 aspect ratio
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
    
    // Handle load errors
    image.onerror = (e) => {
      console.error(`Failed to load image: ${imageUrl}`, e);
      setHasError(true);
      setIsLoaded(false);
      
      // Try loading a local fallback image if available
      if (!imageUrl.includes('placeholder.svg')) {
        const fallbackImage = new Image();
        fallbackImage.crossOrigin = "anonymous";
        fallbackImage.onload = () => {
          console.log("Using fallback image instead");
          setIsLoaded(true);
          setHasError(false);
          imageRef.current = fallbackImage;
          
          if (canvasRef.current) {
            // Set up canvas and animation with fallback image
            const container = canvasRef.current.parentElement;
            if (container) {
              const containerWidth = container.clientWidth;
              canvasRef.current.width = containerWidth;
              canvasRef.current.height = (containerWidth * 9) / 16;
            }
            
            const pixelAnimation = createPixelationAnimation(
              fallbackImage,
              canvasRef.current,
              duration,
              onRevealComplete
            );
            
            setAnimation(pixelAnimation);
          }
        };
        
        fallbackImage.src = '/placeholder.svg';
      }
    };
    
    // Try with a direct URL first (no proxy)
    image.src = imageUrl;
    
    // If it doesn't load within 3 seconds, try with a proxy
    const timeoutId = setTimeout(() => {
      if (!isLoaded && !hasError) {
        console.log("Attempting to load image via proxy...");
        image.src = getProxiedImageUrl(imageUrl);
      }
    }, 3000);
    
    // Cleanup on component unmount or URL change
    return () => {
      clearTimeout(timeoutId);
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
            canvasRef.current.height = (containerWidth * 9) / 16; // Maintain 16:9 aspect ratio
            
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
    <div className="pixel-reveal-container glass-panel relative">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary animate-pulse-subtle">
          <span className="text-muted-foreground">Loading image...</span>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
          <span className="text-destructive">Failed to load image</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="shine-effect"></div>
    </div>
  );
};

export default MovieImage;
