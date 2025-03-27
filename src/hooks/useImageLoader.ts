
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
  
  // Fixed progress with only a single state update
  const loadingProgress = isLoading ? 50 : 100;
  
  const loadImage = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    
    // Short timeout of 2 seconds max
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setTimeoutError(true);
        setIsLoading(false);
        if (onImageError) onImageError();
      }
    }, 2000);
    
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
    
    // No cache busting to avoid extra requests
    image.src = imageUrl;
  };

  useEffect(() => {
    if (imageUrl) {
      loadImage();
    }
    
    return () => {};
  }, [imageUrl]);

  return {
    imageRef,
    isLoaded,
    isLoading,
    loadError,
    timeoutError,
    loadingProgress,
    handleRetry: loadImage
  };
}
