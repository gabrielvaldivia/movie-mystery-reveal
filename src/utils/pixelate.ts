
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
    drawImageProperly(ctx, imageElement, canvas.width, canvas.height);
    return;
  }

  // Calculate the size of the pixelated image
  const w = Math.ceil(canvas.width / pixelSize);
  const h = Math.ceil(canvas.height / pixelSize);

  // Create a temporary canvas to draw the image properly first
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  // Draw the image properly centered and contained in the temp canvas
  drawImageProperly(tempCtx, imageElement, tempCanvas.width, tempCanvas.height);
  
  // Step 1: Draw the temp canvas at a smaller size
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
};

// Helper function to properly draw an image contained within a canvas
function drawImageProperly(
  ctx: CanvasRenderingContext2D, 
  img: HTMLImageElement, 
  canvasWidth: number, 
  canvasHeight: number
) {
  // Get image dimensions
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  
  // Calculate aspect ratios
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  
  let drawWidth, drawHeight, x, y;
  
  // Determine how to fit the image (contain)
  if (imgRatio > canvasRatio) {
    // Image is wider than canvas (relative to height)
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imgRatio;
    x = 0;
    y = (canvasHeight - drawHeight) / 2;
  } else {
    // Image is taller than canvas (relative to width)
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imgRatio;
    x = (canvasWidth - drawWidth) / 2;
    y = 0;
  }
  
  // Draw the image centered and contained
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, drawWidth, drawHeight);
}

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

  const forceComplete = () => {
    // Force pixelation level to 0 (fully unpixelated)
    currentLevel = 0;
    applyPixelation(imageElement, canvas, currentLevel);
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
    getCurrentLevel: () => currentLevel,
    forceComplete
  };
};
