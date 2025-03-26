
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
  forceComplete: () => void
} => {
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let pauseTime: number | null = null;
  let elapsedBeforePause: number = 0;
  let currentLevel = 1; // Start with maximum pixelation
  let isAnimating = false;

  const animate = (timestamp: number) => {
    if (!isAnimating) return;
    
    if (startTime === null) {
      startTime = timestamp;
    }

    // Calculate elapsed time accounting for pauses
    const elapsed = timestamp - startTime + elapsedBeforePause;
    
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
      isAnimating = false;
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
      isAnimating = false;
      if (onComplete) onComplete();
    }
  };

  const forceComplete = () => {
    // Force pixelation level to 0 (fully unpixelated)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    isAnimating = false;
    currentLevel = 0;
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error in force complete:", error);
    }
    if (onComplete) onComplete();
  };

  return {
    start: () => {
      // If already animating, do nothing
      if (isAnimating) return;
      
      // Reset animation state if it was completed
      if (currentLevel === 0) {
        currentLevel = 1;
        elapsedBeforePause = 0;
      }
      
      // If we were paused, calculate elapsed time before pause
      if (pauseTime !== null && startTime !== null) {
        elapsedBeforePause += pauseTime - startTime;
      }
      
      // Reset timing variables for the new animation segment
      startTime = null;
      pauseTime = null;
      isAnimating = true;
      
      // Start animation
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(animate);
      console.log("Animation started");
    },
    stop: () => {
      // Only do something if we are currently animating
      if (isAnimating) {
        // Record when we paused
        pauseTime = performance.now();
        isAnimating = false;
        
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        console.log("Animation paused");
      }
    },
    forceComplete
  };
};
