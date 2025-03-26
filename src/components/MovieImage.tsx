
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
    
    image.onload = () => {
      setIsLoaded(true);
      
      if (canvasRef.current) {
        // Set canvas dimensions based on container
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = (container.clientWidth / image.width) * image.height;
        }
        
        // Create pixelation animation
        const pixelAnimation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        setAnimation(pixelAnimation);
      }
    };
    
    image.onerror = () => {
      setHasError(true);
    };
    
    // Set image source
    image.src = imageUrl;
    
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [imageUrl, duration, onRevealComplete]);

  // Start or stop animation based on isActive prop
  useEffect(() => {
    if (animation && isLoaded && isActive) {
      animation.start();
    } else if (animation) {
      animation.stop();
    }
  }, [isActive, animation, isLoaded]);

  return (
    <div className="pixel-reveal-container glass-panel rounded-md overflow-hidden relative">
      {!isLoaded && !hasError && (
        <Skeleton className="w-full h-full" />
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
          <span className="text-muted-foreground">Image failed to load</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className={`w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default MovieImage;
