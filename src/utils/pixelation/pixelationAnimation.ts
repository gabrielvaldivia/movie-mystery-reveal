
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
  let currentLevel = 1; // Start with maximum pixelation

  const animate = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    
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

  const forceComplete = () => {
    // Force pixelation level to 0 (fully unpixelated)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
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
      // Reset animation state
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      
      startTime = null;
      currentLevel = 1;
      
      animationFrameId = requestAnimationFrame(animate);
      console.log("Animation started");
    },
    stop: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },
    forceComplete
  };
};
