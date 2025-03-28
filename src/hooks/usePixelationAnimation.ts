import { useRef, useEffect, useState } from 'react';
import { createPixelationAnimation } from '../utils/pixelation';

interface UsePixelationAnimationProps {
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  duration: number;
  onRevealComplete?: () => void;
  isActive: boolean;
  isLoaded: boolean;
  isPaused?: boolean;
}

export function usePixelationAnimation({
  imageRef,
  duration,
  onRevealComplete,
  isActive,
  isLoaded,
  isPaused = false
}: UsePixelationAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalIsPaused, setInternalIsPaused] = useState(false);
  const animationRef = useRef<{ 
    start: () => void; 
    stop: () => void;
    pause: () => void;
    resume: () => void;
    isPaused: () => boolean;
    forceComplete: () => void 
  } | null>(null);

  useEffect(() => {
    if (!animationRef.current || !isLoaded) return;
    
    if (isPaused && !animationRef.current.isPaused()) {
      console.log("Pausing animation from external state");
      animationRef.current.pause();
      setInternalIsPaused(true);
    } else if (!isPaused && animationRef.current.isPaused()) {
      console.log("Resuming animation from external state");
      animationRef.current.resume();
      setInternalIsPaused(false);
    }
  }, [isPaused, isLoaded]);

  useEffect(() => {
    if (!animationRef.current || !isLoaded || !imageRef.current || !canvasRef.current) return;
    
    console.log("Animation state changed. isActive:", isActive);
    
    if (isActive) {
      console.log("Starting animation");
      animationRef.current.start();
      
      if (isPaused) {
        console.log("Pausing newly started animation");
        setTimeout(() => {
          if (animationRef.current) {
            animationRef.current.pause();
            setInternalIsPaused(true);
          }
        }, 10);
      }
    } else {
      console.log("Forcing animation complete");
      animationRef.current.forceComplete();
    }
  }, [isActive, isLoaded, isPaused]);
  
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
        if (isPaused) {
          setTimeout(() => animation.pause(), 10);
        }
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
  }, [duration, isLoaded, isActive, onRevealComplete, isPaused]);
  
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
              if (isPaused) {
                setTimeout(() => animation.pause(), 10);
              }
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
  }, [duration, isActive, isLoaded, onRevealComplete, isPaused]);

  const togglePause = () => {
    if (!animationRef.current) return;
    
    const newPausedState = !internalIsPaused;
    setInternalIsPaused(newPausedState);
    
    if (newPausedState) {
      animationRef.current.pause();
    } else {
      animationRef.current.resume();
    }
  };

  return {
    canvasRef,
    animationRef,
    isPaused: internalIsPaused,
    togglePause
  };
}
