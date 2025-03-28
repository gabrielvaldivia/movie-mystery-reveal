
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
  let animationStopped = false;

  const animate = (timestamp: number) => {
    // Critical: If paused, don't continue animation
    if (paused || animationStopped) {
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
      // Only call onComplete if animation wasn't stopped or paused
      if (onComplete && !animationStopped && !paused) {
        console.log("Animation complete - triggering onComplete");
        onComplete();
      } else {
        console.log("Animation complete but not triggering onComplete - stopped:", animationStopped, "paused:", paused);
      }
    }
  };

  const pause = () => {
    if (paused || !animationFrameId || animationStopped) return;
    
    // Set paused state BEFORE canceling the animation frame
    paused = true;
    pauseTime = performance.now();
    
    // Crucial: Cancel the animation frame to actually stop the animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    if (startTime !== null) {
      elapsedBeforePause += pauseTime - startTime;
    }
    
    // Important: Re-apply the current level to ensure it stays visible
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error freezing pixelation level:", error);
    }
    
    console.log("Animation paused at level:", currentLevel);
  };
  
  const resume = () => {
    if (!paused || animationStopped) return;
    
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

    // Set as stopped before clearing pixelation
    animationStopped = true;
    paused = false;
    
    currentLevel = 0;
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error in force complete:", error);
    }
    
    if (onComplete) {
      console.log("Force complete - triggering onComplete");
      onComplete();
    }
  };

  const stop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    animationStopped = true;
    paused = false;
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
      animationStopped = false;
      
      animationFrameId = requestAnimationFrame(animate);
      console.log("Animation started");
    },
    stop,
    pause,
    resume,
    isPaused: () => paused,
    forceComplete
  };
};
