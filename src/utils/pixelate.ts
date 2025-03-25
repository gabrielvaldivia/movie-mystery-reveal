
/**
 * Utility to create a pixelation effect on an image
 * The pixelation level goes from 0 (no pixelation) to 1 (maximum pixelation)
 */

export const applyPixelation = (
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement,
  pixelationLevel: number // 0 to 1, where 1 is most pixelated
): void => {
  if (!imageElement.complete || !imageElement.naturalWidth) {
    console.log("Image not ready for pixelation");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get canvas context");
    return;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the pixel size based on pixelation level
  // This ensures that the pixelation effect scales with the image size
  const minPixelSize = 1; // minimum pixel size (no pixelation)
  const maxPixelSize = Math.max(canvas.width, canvas.height) / 15; // maximum pixel size
  const pixelSize = Math.max(
    minPixelSize,
    Math.round(pixelationLevel * maxPixelSize)
  );

  // If pixelation level is very low, just draw the image normally
  if (pixelSize <= 1) {
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    return;
  }

  try {
    // Draw directly to the main canvas at intended size first (for fallback if other method fails)
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    // Calculate the size of the pixelated image
    const w = Math.max(1, Math.ceil(canvas.width / pixelSize));
    const h = Math.max(1, Math.ceil(canvas.height / pixelSize));
    
    // Create a temporary canvas for the pixelation effect
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    
    if (!offscreenCtx) {
      console.error("Could not get offscreen canvas context");
      return;
    }
    
    // Step 1: Draw the image at a smaller size
    offscreenCtx.drawImage(imageElement, 0, 0, w, h);
    
    // Step 2: Clear the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Step 3: Turn off image smoothing for a blocky look
    ctx.imageSmoothingEnabled = false;
    
    // Step 4: Draw the small image back to the canvas at full size
    ctx.drawImage(
      offscreenCanvas, 
      0, 0, w, h,
      0, 0, canvas.width, canvas.height
    );
  } catch (error) {
    console.error("Error applying pixelation:", error);
    // Fallback to direct drawing if pixelation fails
    try {
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } catch (fallbackError) {
      console.error("Even fallback drawing failed:", fallbackError);
    }
  }
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
  getCurrentLevel: () => number 
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
    applyPixelation(imageElement, canvas, currentLevel);

    // Continue animation if not complete
    if (elapsed < duration) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Animation complete
      currentLevel = 0;
      applyPixelation(imageElement, canvas, currentLevel);
      if (onComplete) onComplete();
    }
  };

  return {
    start: () => {
      // Stop any existing animation
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      startTime = null;
      currentLevel = 1;
      animationFrameId = requestAnimationFrame(animate);
    },
    stop: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },
    getCurrentLevel: () => currentLevel
  };
};
