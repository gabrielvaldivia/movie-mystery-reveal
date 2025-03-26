
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
  const [hasError, setHasError] = useState(false);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
  } | null>(null);

  // Create and set up image when component mounts or imageUrl changes
  useEffect(() => {
    console.log("Loading image:", imageUrl); // Debug logging
    
    const image = new Image();
    
    // Add crossOrigin attribute to avoid CORS issues
    image.crossOrigin = "anonymous";
    imageRef.current = image;
    
    image.onload = () => {
      console.log("Image loaded successfully:", imageUrl);
      setIsLoaded(true);
      setHasError(false);
      
      if (canvasRef.current) {
        // Match canvas dimensions to container while maintaining aspect ratio
        const container = canvasRef.current.parentElement;
        if (container) {
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

    image.onerror = (e) => {
      console.error(`Failed to load image: ${imageUrl}`, e);
      setIsLoaded(true); // Still mark as loaded so we can show fallback
      setHasError(true);
      
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = (container.clientWidth * 9) / 16;
        }
        
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          // Draw fallback message
          ctx.fillStyle = "#3a3a3a";
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.fillStyle = "#ffffff";
          ctx.font = "16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Movie image", canvasRef.current.width / 2, canvasRef.current.height / 2);
        }
      }
    };
    
    // Set the source AFTER setting up handlers
    image.src = imageUrl;

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [imageUrl, duration, onRevealComplete]);

  // Start or stop animation based on isActive prop
  useEffect(() => {
    if (animation && isLoaded && !hasError) {
      if (isActive) {
        animation.start();
      } else {
        animation.stop();
      }
    }
  }, [isActive, animation, isLoaded, hasError]);

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
            
            if (hasError) {
              // Redraw error message
              const ctx = canvasRef.current.getContext("2d");
              if (ctx) {
                ctx.fillStyle = "#3a3a3a";
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.fillStyle = "#ffffff";
                ctx.font = "16px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Movie image", canvasRef.current.width / 2, canvasRef.current.height / 2);
              }
              return;
            }
            
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
  }, [animation, duration, onRevealComplete, isActive, hasError]);

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
