import { applyPixelation } from './applyPixelation';

export const createEasyModeAnimation = (
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement,
  duration: number = 30000,
  onComplete?: () => void
) => {
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let pauseTime: number | null = null;
  let elapsedBeforePause: number = 0;
  let currentLevel = 1; // Start with maximum pixelation
  let paused = false;
  let animationStopped = false;

  const MIN_PIXELATION = 0.2; // Stop at 20% pixelation in easy mode

  const animate = (timestamp: number) => {
    if (paused || animationStopped) {
      return;
    }
    
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = elapsedBeforePause + (timestamp - startTime);
    
    // Calculate pixelation level but don't go below MIN_PIXELATION during normal animation
    currentLevel = Math.max(MIN_PIXELATION, 1 - elapsed / duration);

    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Animation frame error:", error);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      currentLevel = MIN_PIXELATION;
      return;
    }

    if (elapsed < duration) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Animation complete - ensure we render at MIN_PIXELATION
      currentLevel = MIN_PIXELATION;
      try {
        applyPixelation(imageElement, canvas, currentLevel);
      } catch (error) {
        console.error("Error in final animation frame:", error);
      }
      if (onComplete && !animationStopped && !paused) {
        console.log("Animation complete - triggering onComplete");
        onComplete();
      }
    }
  };

  const pause = () => {
    if (paused || !animationFrameId || animationStopped) return;
    
    paused = true;
    pauseTime = performance.now();
    
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    if (startTime !== null) {
      elapsedBeforePause += pauseTime - startTime;
    }
    
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error freezing pixelation level:", error);
    }
  };
  
  const resume = () => {
    if (!paused || animationStopped) return;
    
    paused = false;
    startTime = performance.now();
    
    animationFrameId = requestAnimationFrame(animate);
  };

  const forceComplete = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    animationStopped = true;
    paused = false;
    
    // When forcing complete, remove all pixelation
    currentLevel = 0;
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error in force complete:", error);
    }
    
    if (onComplete && !animationStopped && !paused) {
      console.log("Force complete - triggering onComplete");
      onComplete();
    } else {
      console.log("Force complete but not triggering onComplete - stopped:", animationStopped, "paused:", paused);
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
    },
    stop,
    pause,
    resume,
    isPaused: () => paused,
    forceComplete
  };
}; 