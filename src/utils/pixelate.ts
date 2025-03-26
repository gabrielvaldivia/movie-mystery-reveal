
/**
 * Utility to create a pixelation effect on an image
 * The pixelation level goes from 0 (no pixelation) to 1 (maximum pixelation)
 */

export const applyPixelation = (
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement,
  pixelationLevel: number // 0 to 1, where 1 is most pixelated
): void => {
  if (!imageElement.complete || imageElement.naturalWidth === 0) {
    console.warn("Image is not fully loaded yet");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }

  try {
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

    // Calculate the size of the pixelated image
    const w = Math.max(1, Math.ceil(canvas.width / pixelSize));
    const h = Math.max(1, Math.ceil(canvas.height / pixelSize));

    // Step 1: Draw the image at a smaller size
    ctx.drawImage(imageElement, 0, 0, w, h);

    try {
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
    } catch (e) {
      // If we hit a security error (like CORS issues), just try a simpler approach
      console.warn("Pixelation hit a security error, using fallback approach", e);
      
      // Fallback: just draw at full size with scaling
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw pixelated version
      const scaleX = canvas.width / w;
      const scaleY = canvas.height / h;
      
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.drawImage(imageElement, 0, 0, w, h);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  } catch (error) {
    console.error("Error applying pixelation:", error);
    // In case of error, attempt to at least show the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.error("Could not render image:", e);
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
