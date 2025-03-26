
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

    // Calculate the size of the pixelated image
    const w = Math.ceil(canvas.width / pixelSize);
    const h = Math.ceil(canvas.height / pixelSize);

    // Create a temporary canvas for the initial image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    // Also set willReadFrequently on temporary canvas context
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;
    
    // Draw the original image properly scaled
    drawImageWithCover(imageElement, tempCanvas, tempCtx);
    
    // Step 1: Draw the scaled image at a smaller size
    ctx.drawImage(tempCanvas, 0, 0, w, h);

    // Step 2: Save the small image data
    const smallImageData = ctx.getImageData(0, 0, w, h);
    
    // Step 3: Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Step 4: Turn off image smoothing for a blocky look
    ctx.imageSmoothingEnabled = false;
    
    // Step 5: Draw the small image back to the canvas at full size
    ctx.putImageData(smallImageData, 0, 0);
    ctx.drawImage(
      canvas, 
      0, 0, w, h,
      0, 0, canvas.width, canvas.height
    );
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
  getCurrentLevel: () => number,
  forceComplete: () => void,
  resume: (pausedTime: number) => void
} => {
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let currentLevel = 1; // Start with maximum pixelation
  let pausedElapsedTime = 0; // Store elapsed time when paused

  const animate = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp - pausedElapsedTime; // Adjust for paused time
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
      // Animation complete
      currentLevel = 0;
      try {
        applyPixelation(imageElement, canvas, currentLevel);
      } catch (error) {
        console.error("Error in final animation frame:", error);
      }
      if (onComplete) onComplete();
    }
  };

  const stop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Store elapsed time for resuming later
    if (startTime !== null) {
      pausedElapsedTime = performance.now() - startTime;
    }
  };

  const resume = (pausedTime: number = pausedElapsedTime) => {
    // Set pausedElapsedTime for resuming animation
    pausedElapsedTime = pausedTime;
    startTime = null;
    animationFrameId = requestAnimationFrame(animate);
  };

  const forceComplete = () => {
    // Force pixelation level to 0 (fully unpixelated)
    currentLevel = 0;
    try {
      applyPixelation(imageElement, canvas, currentLevel);
    } catch (error) {
      console.error("Error in force complete:", error);
    }
  };

  return {
    start: () => {
      // Stop any existing animation
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      startTime = null;
      pausedElapsedTime = 0;
      currentLevel = 1;
      animationFrameId = requestAnimationFrame(animate);
    },
    stop,
    getCurrentLevel: () => currentLevel,
    forceComplete,
    resume
  };
};
