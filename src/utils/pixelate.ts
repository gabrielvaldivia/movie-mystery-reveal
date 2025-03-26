
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
    console.log("Image not complete yet");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context");
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
    // Calculate dimensions to center and cover the canvas
    const { width: imgWidth, height: imgHeight } = imageElement;
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
    
    try {
      ctx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight);
    } catch (e) {
      console.error("Error drawing unpixelated image:", e);
    }
    return;
  }

  // Calculate the size of the pixelated image
  const w = Math.ceil(canvas.width / pixelSize);
  const h = Math.ceil(canvas.height / pixelSize);

  // Create a temporary canvas for the intermediate steps
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    console.error("Could not get temporary 2D context");
    return;
  }
  
  // First, draw the image properly scaled to fill the canvas
  const { width: imgWidth, height: imgHeight } = imageElement;
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
  
  try {
    // Draw original image to temporary canvas first
    tempCtx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight);
    
    // Step 1: Draw the full-sized image from temp canvas to main canvas at a smaller size (for pixelation)
    ctx.drawImage(tempCanvas, 0, 0, w, h);
    
    // Step 2: Turn off image smoothing for a blocky look
    ctx.imageSmoothingEnabled = false;
    
    // Step 3: Draw the small image back to the canvas at full size (pixelated)
    ctx.drawImage(
      canvas, 
      0, 0, w, h,
      0, 0, canvas.width, canvas.height
    );
  } catch (e) {
    console.error("Error in pixelation process:", e, {
      imageLoaded: imageElement.complete,
      imageNaturalWidth: imageElement.naturalWidth,
      imageNaturalHeight: imageElement.naturalHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });
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

  // Initialize by applying maximum pixelation
  applyPixelation(imageElement, canvas, currentLevel);

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
