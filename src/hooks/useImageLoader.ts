
import { useState, useRef, useEffect } from 'react';

interface UseImageLoaderProps {
  imageUrl: string;
  onImageLoaded?: () => void;
  onImageError?: () => void;
}

export function useImageLoader({
  imageUrl,
  onImageLoaded,
  onImageError
}: UseImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Much simpler progress logic with fewer intervals and computations
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(25);
      const timer = setTimeout(() => {
        setLoadingProgress(75);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);
  
  const loadImage = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    
    // Simple timeout of 2.5 seconds max
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setTimeoutError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    }, 2500);
    
    const image = new Image();
    
    image.onload = () => {
      clearTimeout(timeoutId);
      imageRef.current = image;
      setIsLoaded(true);
      setIsLoading(false);
      if (onImageLoaded) {
        onImageLoaded();
      }
    };
    
    image.onerror = () => {
      clearTimeout(timeoutId);
      setLoadError(true);
      setIsLoading(false);
      if (onImageError) onImageError();
    };
    
    // Simple cache buster
    image.src = `${imageUrl}?cb=${Date.now()}`;
  };

  useEffect(() => {
    if (imageUrl) {
      loadImage();
    }
    
    return () => {};
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
