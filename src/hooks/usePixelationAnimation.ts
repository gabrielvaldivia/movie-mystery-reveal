
import { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelation';

interface UsePixelationAnimationProps {
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  duration: number;
  onRevealComplete?: () => void;
  isActive: boolean;
  isLoaded: boolean;
}

export function usePixelationAnimation({
  imageRef,
  duration,
  onRevealComplete,
  isActive,
  isLoaded
}: UsePixelationAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<{ 
    start: () => void; 
    stop: () => void;
    pause: () => void;
    resume: () => void;
    isPaused: () => boolean;
    forceComplete: () => void 
  } | null>(null);

  useEffect(() => {
    if (!animationRef.current || !isLoaded || !imageRef.current || !canvasRef.current) return;
    
    console.log("Animation state changed. isActive:", isActive);
    
    if (isActive) {
      console.log("Starting animation");
      animationRef.current.start();
    } else {
      console.log("Forcing animation complete");
      animationRef.current.forceComplete();
    }
  }, [isActive, isLoaded]);
  
  useEffect(() => {
    if (!isLoaded || !imageRef.current || !canvasRef.current) return;
    
    const container = canvasRef.current.parentElement;
    if (!container) return;
    
    canvasRef.current.width = container.clientWidth;
    canvasRef.current.height = container.clientHeight;
    
    try {
      const animation = createPixelationAnimation(
        imageRef.current,
        canvasRef.current,
        duration,
        onRevealComplete
      );
      
      animationRef.current = animation;
      
      if (isActive) {
        animation.start();
      } else {
        animation.forceComplete();
      }
    } catch (error) {
      console.error("Error creating animation:", error);
    }
    
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [duration, isLoaded, isActive, onRevealComplete]);
  
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !imageRef.current || !isLoaded) return;
      
      const container = canvasRef.current.parentElement;
      if (!container) return;
      
      if (Math.abs(canvasRef.current.width - container.clientWidth) > 10 || 
          Math.abs(canvasRef.current.height - container.clientHeight) > 10) {
        
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
        
        if (animationRef.current) {
          animationRef.current.stop();
          
          try {
            const animation = createPixelationAnimation(
              imageRef.current,
              canvasRef.current,
              duration,
              onRevealComplete
            );
            
            animationRef.current = animation;
            
            if (isActive) {
              animation.start();
            } else {
              animation.forceComplete();
            }
          } catch (error) {
            console.error("Error recreating animation on resize:", error);
          }
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [duration, isActive, isLoaded, onRevealComplete]);

  const togglePause = () => {
    if (!animationRef.current) return;
    
    if (isPaused) {
      animationRef.current.resume();
      setIsPaused(false);
    } else {
      animationRef.current.pause();
      setIsPaused(true);
    }
  };

  return {
    canvasRef,
    animationRef,
    isPaused,
    togglePause
  };
}
