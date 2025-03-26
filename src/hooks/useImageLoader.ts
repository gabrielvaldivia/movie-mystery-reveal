
import { useState, useRef, useEffect } from 'react';
import { useLoadingProgress } from './useLoadingProgress';

interface UseImageLoaderProps {
  imageUrl: string;
  onImageLoaded?: () => void;
  onImageError?: () => void;
  loadingTimeout?: number;
}

interface UseImageLoaderResult {
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  isLoaded: boolean;
  isLoading: boolean;
  loadError: boolean;
  timeoutError: boolean;
  loadingProgress: number;
  handleRetry: () => void;
}

export function useImageLoader({
  imageUrl,
  onImageLoaded,
  onImageError,
  loadingTimeout = 4000 // Reduced from 8000ms to 4000ms
}: UseImageLoaderProps): UseImageLoaderResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the extracted loading progress hook with faster duration
  const { loadingProgress, resetProgress } = useLoadingProgress({ 
    isLoading,
    duration: loadingTimeout * 0.6 // Use 60% of the timeout for the progress animation
  });
  
  const loadImage = () => {
    console.log("Starting to load image:", imageUrl);
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    resetProgress();
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    timerRef.current = setTimeout(() => {
      if (!isLoaded) {
        console.error("Image load timed out:", imageUrl);
        setTimeoutError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    }, loadingTimeout);
    
    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      console.log("Image loaded successfully:", imageUrl);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      imageRef.current = image;
      setIsLoaded(true);
      setIsLoading(false);
      
      if (onImageLoaded) {
        // Remove delay to make it seem faster
        onImageLoaded();
      }
    };
    
    image.onerror = (error) => {
      console.error("Error loading image:", imageUrl, error);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      setLoadError(true);
      setIsLoading(false);
      if (onImageError) onImageError();
    };
    
    // Set a more aggressive cache-busting parameter
    const cacheBuster = Date.now();
    image.src = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cb=${cacheBuster}&force=true`;
  };

  useEffect(() => {
    if (!imageUrl) return;
    
    loadImage();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [imageUrl]);

  const handleRetry = () => {
    loadImage();
  };

  return {
    imageRef,
    isLoaded,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry
  };
}
