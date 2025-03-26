
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
  loadingTimeout = 15000
}: UseImageLoaderProps): UseImageLoaderResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the extracted loading progress hook
  const { loadingProgress, resetProgress } = useLoadingProgress({ 
    isLoading,
    duration: loadingTimeout * 0.8 // Use 80% of the timeout for the progress animation
  });
  
  const loadImage = () => {
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
        setTimeoutError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    }, loadingTimeout);
    
    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      imageRef.current = image;
      setIsLoaded(true);
      setIsLoading(false);
      
      if (onImageLoaded) {
        onImageLoaded();
      }
    };
    
    image.onerror = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      console.error("Error loading image:", imageUrl);
      setLoadError(true);
      setIsLoading(false);
      if (onImageError) onImageError();
    };
    
    image.src = imageUrl;
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
