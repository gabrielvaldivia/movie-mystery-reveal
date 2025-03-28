
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
  const animationStartedRef = useRef(false);

  // This effect handles external pause state changes
  useEffect(() => {
    if (!animationRef.current || !isLoaded) return;
    
    // First update internal state to match external state
    setInternalIsPaused(isPaused);
    
    // Then apply the pause/resume action based on the new state
    if (isPaused && !animationRef.current.isPaused()) {
      console.log("Pausing animation from external state");
      animationRef.current.pause();
    } else if (!isPaused && animationRef.current.isPaused()) {
      console.log("Resuming animation from external state");
      animationRef.current.resume();
    }
  }, [isPaused, isLoaded]);

  // Effect to create and control animation based on active state
  useEffect(() => {
    if (!isLoaded || !imageRef.current || !canvasRef.current) return;
    
    console.log("Animation state changed. isActive:", isActive, "isPaused:", isPaused);
    
    // Create animation if it doesn't exist yet
    if (!animationRef.current) {
      try {
        const container = canvasRef.current.parentElement;
        if (!container) return;
        
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
        
        const animation = createPixelationAnimation(
          imageRef.current,
          canvasRef.current,
          duration,
          onRevealComplete
        );
        
        animationRef.current = animation;
      } catch (error) {
        console.error("Error creating animation:", error);
        return;
      }
    }
    
    if (isActive && animationRef.current) {
      if (animationRef.current.isPaused() && !isPaused) {
        console.log("Resuming animation");
        animationRef.current.resume();
      } else if (!animationRef.current.isPaused() && isPaused) {
        console.log("Pausing animation");
        animationRef.current.pause();
      } else if (!animationRef.current.isPaused() && !isPaused && !animationStartedRef.current) {
        console.log("Starting animation");
        animationRef.current.start();
        animationStartedRef.current = true;
      }
    } else if (!isActive && animationRef.current) {
      console.log("Forcing animation complete");
      animationRef.current.forceComplete();
      animationStartedRef.current = false;
    }
  }, [isActive, isLoaded, isPaused, duration, onRevealComplete]);
  
  // Handle window resize - recreate animation at new canvas size
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
          // Remember if we were paused before recreating
          const wasPaused = animationRef.current.isPaused();
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
              animationStartedRef.current = true;
              if (wasPaused || isPaused) {
                animation.pause();
                setInternalIsPaused(true);
              }
            } else {
              animation.forceComplete();
              animationStartedRef.current = false;
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
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animationStartedRef.current = false;
    };
  }, []);

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
