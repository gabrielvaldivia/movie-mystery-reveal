
import React, { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';

interface MovieImageProps {
  imageUrl: string;
  duration: number; // in milliseconds
  onRevealComplete?: () => void;
  isActive: boolean;
  children?: React.ReactNode;
}

const MovieImage: React.FC<MovieImageProps> = ({ 
  imageUrl, 
  duration, 
  onRevealComplete,
  isActive,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
    forceComplete: () => void;
  } | null>(null);

  // Use a single effect for image handling to prevent multiple image creations
  useEffect(() => {
    // Always clean up previous animation before creating a new one
    if (animation) {
      animation.stop();
    }

    // Create image WITHOUT adding it to the DOM
    const image = new Image();
    
    // Store reference - this will replace any previous reference
    imageRef.current = image;
    
    // Configure image
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    const handleImageLoad = () => {
      setIsLoaded(true);
      
      if (canvasRef.current && imageRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
        
        const pixelAnimation = createPixelationAnimation(
          imageRef.current,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        setAnimation(pixelAnimation);
        
        // If active, start the animation right away
        if (isActive) {
          pixelAnimation.start();
        } else {
          pixelAnimation.forceComplete();
        }
      }
    };

    // Set up the onload handler
    image.onload = handleImageLoad;

    // Clean up function
    return () => {
      if (animation) {
        animation.stop();
      }
      
      // Remove event listener
      image.onload = null;
      
      // Clear reference
      imageRef.current = null;
    };
  }, [imageUrl, duration, onRevealComplete]);

  // Handle active state changes
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

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          if (Math.abs(canvasRef.current.width - containerWidth) > 10 || 
              Math.abs(canvasRef.current.height - containerHeight) > 10) {
            
            canvasRef.current.width = containerWidth;
            canvasRef.current.height = containerHeight;
            
            if (animation) {
              animation.stop();
              
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
            }
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animation, duration, onRevealComplete, isActive]);

  return (
    <div className="pixel-reveal-container glass-panel relative w-full h-full overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary animate-pulse-subtle">
          <span className="text-muted-foreground">Loading image...</span>
        </div>
      )}
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-contain transition-opacity duration-300"
      />
      
      {children && (
        <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default MovieImage;
