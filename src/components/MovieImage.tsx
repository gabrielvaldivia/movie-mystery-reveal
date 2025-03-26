
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

  useEffect(() => {
    // Clean up any previous image elements
    const cleanup = () => {
      if (imageRef.current) {
        if (imageRef.current.parentNode) {
          imageRef.current.parentNode.removeChild(imageRef.current);
        }
        imageRef.current = null;
      }
    };
    
    // Clean up first
    cleanup();
    
    // Create a new image but don't add it to the DOM
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    image.style.display = 'none';
    imageRef.current = image;

    image.onload = () => {
      setIsLoaded(true);
      
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
        
        const pixelAnimation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        setAnimation(pixelAnimation);
      }
    };

    return cleanup;
  }, [imageUrl, duration, onRevealComplete]);

  useEffect(() => {
    if (animation && isLoaded) {
      if (isActive) {
        animation.start();
      } else {
        animation.stop();
        if (!isActive) {
          animation.forceComplete();
        }
      }
    }
  }, [isActive, animation, isLoaded]);

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
              
              if (isActive) {
                const newAnimation = createPixelationAnimation(
                  imageRef.current,
                  canvasRef.current,
                  duration,
                  onRevealComplete
                );
                setAnimation(newAnimation);
                newAnimation.start();
              } else {
                const newAnimation = createPixelationAnimation(
                  imageRef.current,
                  canvasRef.current,
                  duration,
                  onRevealComplete
                );
                setAnimation(newAnimation);
                if (newAnimation) {
                  newAnimation.forceComplete();
                }
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
