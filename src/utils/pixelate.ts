
/**
 * Utility to create a pixelation effect on an image
 * The pixelation level goes from 0 (no pixelation) to 1 (maximum pixelation)
 */

export const applyPixelation = (
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement,
  pixelationLevel: number // 0 to 1, where 1 is most pixelated
): void => {
  if (!imageElement.complete) {
    console.log("Image not complete yet, cannot pixelate");
    return;
  }

  // Get context with willReadFrequently set to true for better performance
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    console.error("Could not get 2D context from canvas");
    return;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the pixel size based on pixelation level
  const minPixelSize = 1; // minimum pixel size (no pixelation)
  const maxPixelSize = Math.max(canvas.width, canvas.height) / 15; // maximum pixel size
  const pixelSize = Math.max(
    minPixelSize,
    Math.round(pixelationLevel * maxPixelSize)
  );

  try {
    // If pixelation level is very low, just draw the image normally
    if (pixelSize <= 1) {
      drawImageWithCover(imageElement, canvas, ctx);
      return;
    }

    // Create a temporary canvas for the initial image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;
    
    // Draw the original image properly scaled
    drawImageWithCover(imageElement, tempCanvas, tempCtx);
    
    // Calculate the size of the pixelated version
    const w = Math.ceil(canvas.width / pixelSize);
    const h = Math.ceil(canvas.height / pixelSize);

    // Create a small canvas for pixelation
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = w;
    smallCanvas.height = h;
    const smallCtx = smallCanvas.getContext('2d', { willReadFrequently: true });
    if (!smallCtx) return;
    
    // Step 1: Draw the original image at a smaller size (pixelation)
    smallCtx.drawImage(tempCanvas, 0, 0, w, h);
    
    // Step 2: Turn off image smoothing for all contexts
    ctx.imageSmoothingEnabled = false;
    smallCtx.imageSmoothingEnabled = false;
    tempCtx.imageSmoothingEnabled = false;
    
    // Step 3: Draw the small image back to the main canvas at full size
    ctx.drawImage(smallCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  } catch (error) {
    console.error("Error applying pixelation effect:", error);
  }
};

// Helper function to draw an image with cover positioning
const drawImageWithCover = (
  img: HTMLImageElement, 
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D
): void => {
  const { width: imgWidth, height: imgHeight } = img;
  const imgAspect = imgWidth / imgHeight;
  const canvasAspect = canvas.width / canvas.height;
  
  let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
  
  if (imgAspect > canvasAspect) {
    // Image is wider than canvas (relative to height)
    drawHeight = canvas.height;
    drawWidth = drawHeight * imgAspect;
    offsetX = (canvas.width - drawWidth) / 2;
  } else {
    // Image is taller than canvas (relative to width)
    drawWidth = canvas.width;
    drawHeight = drawWidth / imgAspect;
    offsetY = (canvas.height - drawHeight) / 2;
  }
  
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

// Utility function to create timed pixelation animation
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
  getCurrentLevel: () => number,
  forceComplete: () => void
} => {
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let pauseTime: number | null = null;
  let elapsedBeforePause: number = 0;
  let currentLevel = 1; // Start with maximum pixelation
  let isPaused = false;

  const animate = (timestamp: number) => {
    if (isPaused) return;
    
    if (startTime === null) {
      startTime = timestamp;
    }

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
    if (!isPaused && startTime !== null) {
      isPaused = true;
      pauseTime = performance.now();
      if (startTime !== null) {
        elapsedBeforePause += pauseTime - startTime;
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  };

  const resume = () => {
    if (isPaused) {
      isPaused = false;
      startTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
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
      // Reset animation state but preserve current pixelation level if paused
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Only reset everything if not previously paused
      if (!isPaused) {
        startTime = null;
        pauseTime = null;
        elapsedBeforePause = 0;
        currentLevel = 1;
      }
      
      isPaused = false;
      animationFrameId = requestAnimationFrame(animate);
    },
    stop: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },
    pause,
    resume,
    getCurrentLevel: () => currentLevel,
    forceComplete
  };
};
