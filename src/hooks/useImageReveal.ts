
import { useState, useRef, useEffect } from 'react';
import { createPixelationAnimation } from '../utils/pixelate';

interface UseImageRevealProps {
  imageUrl: string;
  duration: number;
  onRevealComplete?: () => void;
  isActive: boolean;
  onImageLoaded?: () => void;
}

export function useImageReveal({
  imageUrl,
  duration,
  onRevealComplete,
  isActive,
  onImageLoaded
}: UseImageRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const [animation, setAnimation] = useState<{
    start: () => void;
    stop: () => void;
    getCurrentLevel: () => number;
    forceComplete: () => void;
  } | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 2;

  // Function to clean up timers and listeners
  const cleanup = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (animation) {
      animation.stop();
    }
    
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
    }
  };

  const loadImage = () => {
    // Reset states
    setIsLoaded(false);
    setLoadProgress(0);
    setLoadError(false);
    setLoadTimeout(false);
    setAnimation(null);
    
    // Clean up first
    cleanup();
    
    // Create a new image object
    const image = new Image();
    // Add cache-busting and reduce retry count for repeated failures
    image.src = `${imageUrl}?t=${Date.now()}&retry=${retryCount.current}`;
    image.crossOrigin = "anonymous";
    imageRef.current = image;

    // Set a timeout for image loading (8 seconds, reduced from 10)
    timeoutRef.current = window.setTimeout(() => {
      setLoadTimeout(true);
      console.log("Image loading timed out:", imageUrl);
      
      // Try fallback loading if we haven't exceeded max retries
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        loadImage(); // Retry loading
      }
    }, 8000);

    // Simulate progress
    progressIntervalRef.current = window.setInterval(() => {
      setLoadProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 200);

    // Handle successful image load
    image.onload = () => {
      cleanup();
      retryCount.current = 0; // Reset retry counter on success
      
      console.log("Image loaded successfully:", imageUrl);
      setLoadProgress(100);
      setIsLoaded(true);
      
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
        
        try {
          const pixelAnimation = createPixelationAnimation(
            image,
            canvasRef.current,
            duration,
            onRevealComplete
          );
          
          setAnimation(pixelAnimation);
          
          // Call the callback
          if (onImageLoaded) {
            onImageLoaded();
          }
        } catch (error) {
          console.error("Error creating animation:", error);
          setLoadError(true);
        }
      }
    };

    // Handle image load error
    image.onerror = (error) => {
      cleanup();
      console.error("Error loading image:", imageUrl, error);
      
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        console.log(`Retrying image load (${retryCount.current}/${maxRetries}):`, imageUrl);
        loadImage(); // Retry loading
      } else {
        setLoadError(true);
      }
    };
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imageRef.current && isLoaded) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          // Only recreate if significant size change
          if (Math.abs(canvasRef.current.width - containerWidth) > 10 || 
              Math.abs(canvasRef.current.height - containerHeight) > 10) {
            
            canvasRef.current.width = containerWidth;
            canvasRef.current.height = containerHeight;
            
            if (animation) {
              animation.stop();
              
              try {
                const newAnimation = createPixelationAnimation(
                  imageRef.current,
                  canvasRef.current,
                  duration,
                  onRevealComplete
                );
                
                setAnimation(newAnimation);
                
                if (isActive) {
                  newAnimation.start();
                } else {
                  newAnimation.forceComplete();
                }
              } catch (error) {
                console.error("Error recreating animation on resize:", error);
              }
            }
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animation, duration, onRevealComplete, isActive, isLoaded]);

  // Load image when URL changes
  useEffect(() => {
    retryCount.current = 0; // Reset retry counter on URL change
    loadImage();
    
    // Clean up on unmount or URL change
    return cleanup;
  }, [imageUrl]);

  // Handle animation state based on isActive
  useEffect(() => {
    if (animation && isLoaded) {
      if (isActive) {
        animation.start();
      } else {
        animation.stop();
        animation.forceComplete();
      }
    }
  }, [isActive, animation, isLoaded]);

  return {
    canvasRef,
    isLoaded,
    loadProgress,
    loadError,
    loadTimeout,
    loadImage
  };
}
