
/**
 * Utility to create timed pixelation animations
 */
import { applyPixelation } from './applyPixelation';

/**
 * Creates an animation that gradually reduces pixelation over time
 * @param imageElement Image to animate
 * @param canvas Canvas to draw on
 * @param duration Duration of animation in ms
 * @param onComplete Callback when animation completes
 * @returns Object with methods to control the animation
 */
export const createPixelationAnimation = (
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement,
  duration: number = 30000, // Default 30 seconds
  onComplete?: () => void
): { 
  start: () => void, 
  stop: () => void, 
  pause: () => void,
  resume: () => void,
  isPaused: () => boolean,
  forceComplete: () => void
} => {
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let pauseTime: number | null = null;
  let elapsedBeforePause: number = 0;
  let currentLevel = 1; // Start with maximum pixelation
  let paused = false;

  const animate = (timestamp: number) => {
    if (paused) {
      // If we're paused, don't continue the animation
      return;
    }
    
    if (startTime === null) {
      startTime = timestamp;
    }

    // Calculate elapsed time, accounting for any paused time
    const elapsed = elapsedBeforePause + (timestamp - startTime);
    
    // Calculate current pixelation level (1 to 0 over duration)
    currentLevel = Math.max(0, 1 - elapsed / duration);

    // Apply the pixelation effect
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Animation frame error:", error);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      currentLevel = 0;
      return;
    }

    // Continue animation if not complete
    if (elapsed < duration) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Animation complete - ensure we render the final state
      currentLevel = 0;
      try {
        applyPixelation(imageElement, canvas, currentLevel);
      } catch (error) {
        console.error("Error in final animation frame:", error);
      }
      if (onComplete) onComplete();
    }
  };

  const pause = () => {
    if (paused || !animationFrameId) return;
    
    paused = true;
    pauseTime = performance.now();
    
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    if (startTime !== null) {
      elapsedBeforePause += pauseTime - startTime;
    }
    
    console.log("Animation paused at level:", currentLevel);
  };
  
  const resume = () => {
    if (!paused) return;
    
    paused = false;
    startTime = performance.now();
    
    // Restart the animation loop
    animationFrameId = requestAnimationFrame(animate);
    console.log("Animation resumed from level:", currentLevel);
  };

  const forceComplete = () => {
    // Force pixelation level to 0 (fully unpixelated)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    currentLevel = 0;
    paused = false;
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error in force complete:", error);
    }
    if (onComplete) onComplete();
  };

  return {
    start: () => {
      // Reset animation state
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      
      startTime = null;
      pauseTime = null;
      elapsedBeforePause = 0;
      currentLevel = 1;
      paused = false;
      
      animationFrameId = requestAnimationFrame(animate);
      console.log("Animation started");
    },
    stop: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      paused = false;
    },
    pause,
    resume,
    isPaused: () => paused,
    forceComplete
  };
};
