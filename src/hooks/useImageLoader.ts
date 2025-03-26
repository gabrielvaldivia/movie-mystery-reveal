
import { useState, useRef, useEffect } from 'react';

interface UseImageLoaderProps {
  imageUrl: string;
  onImageLoaded?: () => void;
  onImageError?: () => void;
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
  onImageError
}: UseImageLoaderProps): UseImageLoaderResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingProgressRef = useRef<number>(0);

  const loadImage = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    loadingProgressRef.current = 0;
    setLoadingProgress(0);
    
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
    }, 15000);
    
    const progressInterval = setInterval(() => {
      if (loadingProgressRef.current < 90) {
        loadingProgressRef.current += 5;
        setLoadingProgress(loadingProgressRef.current);
      } else {
        clearInterval(progressInterval);
      }
    }, 300);
    
    const image = new Image();
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      clearInterval(progressInterval);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      loadingProgressRef.current = 100;
      setLoadingProgress(100);
      
      imageRef.current = image;
      setIsLoaded(true);
      setIsLoading(false);
      
      if (onImageLoaded) {
        onImageLoaded();
      }
    };
    
    image.onerror = () => {
      clearInterval(progressInterval);
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
