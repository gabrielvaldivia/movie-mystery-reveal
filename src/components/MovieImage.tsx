
import React, { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';
import { AspectRatio } from './ui/aspect-ratio';
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
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
    forceComplete: () => void;
  } | null>(null);

  // Set up canvas and image when component mounts or image URL changes
  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    imageRef.current = image;

    image.onload = () => {
      if (canvasRef.current) {
        // Set canvas dimensions explicitly 
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
        
        // Create and store animation controller
        const pixelAnimation = createPixelationAnimation(
          image,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        setAnimation(pixelAnimation);
        setIsLoaded(true);
      }
    };

    image.onerror = (e) => {
      console.error("Error loading image:", e);
      setIsLoaded(false);
    };

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
        // When round is over (isActive is false), force the image to be fully unpixelated
        animation.forceComplete();
      }
    }
  }, [isActive, animation, isLoaded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          // Only resize if the dimensions change significantly
          if (Math.abs(canvasRef.current.width - containerWidth) > 10 || 
              Math.abs(canvasRef.current.height - containerHeight) > 10) {
            
            canvasRef.current.width = containerWidth;
            canvasRef.current.height = containerHeight;
            
            // Reapply current pixelation level after resize
            if (animation) {
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
              } else {
                // If not active, show the unpixelated image
                const newAnimation = createPixelationAnimation(
                  imageRef.current,
                  canvasRef.current,
                  duration,
                  onRevealComplete
                );
                setAnimation(newAnimation);
                // Only call forceComplete if it exists
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
    <div className="pixel-reveal-container glass-panel w-full">
      <AspectRatio ratio={2/3} className="overflow-hidden">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 animate-pulse">
            <Skeleton className="w-full h-full absolute" />
            <span className="text-muted-foreground relative z-10">Loading image...</span>
          </div>
        ) : null}
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ 
            objectFit: 'cover',
            visibility: isLoaded ? 'visible' : 'hidden'
          }}
        />
      </AspectRatio>
    </div>
  );
};

export default MovieImage;
