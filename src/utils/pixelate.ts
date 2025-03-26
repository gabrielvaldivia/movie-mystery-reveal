
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
  if (!ctx) return;

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
    try {
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.error("Error drawing image at low pixelation:", err);
    }
    return;
  }

  try {
    // Draw directly at the target size with pixelation
    // Turn off image smoothing for a pixelated effect
    ctx.imageSmoothingEnabled = false;
    
    // Calculate a smaller size for the pixelated effect
    const w = Math.ceil(canvas.width / pixelSize);
    const h = Math.ceil(canvas.height / pixelSize);
    
    // Create a temporary canvas for the pixelated effect
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = w;
    tempCanvas.height = h;
    
    // Draw the image at a smaller size
    tempCtx.drawImage(imageElement, 0, 0, w, h);
    
    // Draw the small image back to the main canvas at full size
    ctx.drawImage(tempCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  } catch (err) {
    console.error("Error applying pixelation effect:", err);
    // Fallback: try to draw the image directly if pixelation fails
    try {
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } catch (fallbackErr) {
      console.error("Fallback image drawing also failed:", fallbackErr);
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
