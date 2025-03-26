
import React, { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';
import { AspectRatio } from './ui/aspect-ratio';
import { Skeleton } from './ui/skeleton';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
    forceComplete: () => void;
  } | null>(null);

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setIsLoaded(false);
    setLoadProgress(0);
    
    // Clear any previous animation
    if (animation) {
      animation.stop();
      setAnimation(null);
    }
    
    // Create a new image object for each new imageUrl
    const image = new Image();
    image.src = `${imageUrl}?t=${Date.now()}`; // Add timestamp to prevent caching
    image.crossOrigin = "anonymous";
    imageRef.current = image;

    // Simulate progress while waiting for image to load
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 200);

    image.onload = () => {
      clearInterval(progressInterval);
      setLoadProgress(100);
      setIsLoaded(true);
      
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          canvasRef.current.width = containerWidth;
          canvasRef.current.height = containerHeight;
        }
        
        const pixelAnimation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        setAnimation(pixelAnimation);
        if (onImageLoaded) {
          onImageLoaded();
        }
      }
    };

    return () => {
      clearInterval(progressInterval);
      if (animation) {
        animation.stop();
      }
      // Clean up image reference
      if (imageRef.current) {
        imageRef.current.onload = null;
      }
    };
  }, [imageUrl, duration, onRevealComplete, onImageLoaded]);

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
    <div className="pixel-reveal-container glass-panel no-rounded relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary">
          <div className="w-16 h-16 relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-opacity-20 absolute"></div>
            <div 
              className="w-16 h-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent absolute animate-spin"
              style={{ animationDuration: '1.5s' }}
            ></div>
          </div>
          <div className="w-full max-w-xs px-4">
            <div className="h-2 bg-secondary-foreground/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Loading image...
            </p>
          </div>
        </div>
      )}
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{ objectFit: 'cover' }}
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
