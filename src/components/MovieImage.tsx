
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
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
  } | null>(null);

  // Set up canvas and image when component mounts or image URL changes
  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    imageRef.current = image;

    image.onload = () => {
      setIsLoaded(true);
      
      if (canvasRef.current) {
        // Match canvas dimensions to container while maintaining aspect ratio
        const container = canvasRef.current.parentElement;
        if (container) {
          // For backdrops (screenshots), use the full container width
          // Backdrops typically have a 16:9 aspect ratio which matches our container
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
    <div className="pixel-reveal-container glass-panel">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary animate-pulse-subtle">
          <span className="text-muted-foreground">Loading image...</span>
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
