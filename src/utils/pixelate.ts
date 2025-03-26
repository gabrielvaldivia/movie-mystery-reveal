
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
  const maxPixelSize = Math.max(canvas.width, canvas.height) / 15;
  const pixelSize = Math.round(pixelationLevel * maxPixelSize);

  // If pixelation level is very low, just draw the image normally
  if (pixelSize <= 1) {
    const { width: imgWidth, height: imgHeight } = imageElement;
    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    if (imgAspect > canvasAspect) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetY = (canvas.height - drawHeight) / 2;
    }
    
    ctx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight);
    return;
  }

  // Create a temporary canvas to draw the original image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  // Draw original image to temp canvas
  const { width: imgWidth, height: imgHeight } = imageElement;
  const imgAspect = imgWidth / imgHeight;
  const canvasAspect = canvas.width / canvas.height;
  
  let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
  
  if (imgAspect > canvasAspect) {
    drawHeight = canvas.height;
    drawWidth = drawHeight * imgAspect;
    offsetX = (canvas.width - drawWidth) / 2;
  } else {
    drawWidth = canvas.width;
    drawHeight = drawWidth / imgAspect;
    offsetY = (canvas.height - drawHeight) / 2;
  }
  
  tempCtx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight);
  
  // Calculate size of pixelated image
  const w = Math.ceil(canvas.width / pixelSize);
  const h = Math.ceil(canvas.height / pixelSize);
  
  // Draw at reduced size
  ctx.drawImage(tempCanvas, 0, 0, w, h);
  
  // Turn off image smoothing
  ctx.imageSmoothingEnabled = false;
  
  // Scale back up
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
};

// Simplified pixelation animation
export const createPixelationAnimation = (
  imageElement: HTMLImageElement,
  canvas: HTMLCanvasElement,
  duration: number = 30000,
  onComplete?: () => void
): { 
  start: () => void, 
  stop: () => void, 
  getCurrentLevel: () => number,
  forceComplete: () => void
} => {
  let animationId: number | null = null;
  let startTime = 0;
  let currentLevel = 1;
  
  const animate = (timestamp: number) => {
    if (startTime === 0) {
      startTime = timestamp;
    }
    
    const elapsed = timestamp - startTime;
    const progress = Math.min(1, elapsed / duration);
    
    // Pixelation decreases as progress increases
    currentLevel = 1 - progress;
    
    // Apply pixelation effect
    applyPixelation(imageElement, canvas, currentLevel);
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Animation complete
      if (onComplete) onComplete();
    }
  };
  
  return {
    start: () => {
      // Reset if not already running
      if (animationId === null) {
        startTime = 0;
        currentLevel = 1;
        animationId = requestAnimationFrame(animate);
      }
    },
    stop: () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    getCurrentLevel: () => currentLevel,
    forceComplete: () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      currentLevel = 0;
      applyPixelation(imageElement, canvas, currentLevel);
      if (onComplete) onComplete();
    }
  };
};
