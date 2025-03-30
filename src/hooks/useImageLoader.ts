
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
    console.log("Loading image:", imageUrl);
    
    setIsLoading(true);
    setIsLoaded(false);
    setLoadError(false);
    setTimeoutError(false);
    resetProgress();
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Set a timeout to catch images that take too long to load
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
        onImageLoaded();
      }
    };
    
    image.onerror = (e) => {
      console.error("Error loading image:", imageUrl, e);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      setLoadError(true);
      setIsLoading(false);
      
      if (onImageError) {
        onImageError();
      }
    };
    
    // Actually set the src to start loading
    image.src = imageUrl;
    
    // For some browsers, if the image is cached, the onload event may not fire
    // This additional check helps in those cases
    if (image.complete) {
      console.log("Image was already cached:", imageUrl);
      image.onload?.call(image);
    }
  };

  useEffect(() => {
    if (!imageUrl) {
      console.log("No image URL provided, can't load image");
      setLoadError(true);
      setIsLoading(false);
      return;
    }
    
    loadImage();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [imageUrl]);

  const handleRetry = () => {
    console.log("Retrying image load for:", imageUrl);
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
