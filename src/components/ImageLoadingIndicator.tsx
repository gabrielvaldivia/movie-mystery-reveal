
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

export type ImageLoadingStatus = {
  isLoading: boolean;
  progress: number;
  error: boolean;
  timeout: boolean;
};

interface ImageLoadingIndicatorProps extends ImageLoadingStatus {
  onRetry: () => void;
  loadingMessage?: string;
  errorMessage?: string;
  timeoutMessage?: string;
}

const ImageLoadingIndicator: React.FC<ImageLoadingIndicatorProps> = ({
  isLoading,
  progress,
  error,
  timeout,
  onRetry,
  loadingMessage = "Loading movie image...",
  errorMessage = "Failed to load image",
  timeoutMessage = "Image load timed out"
}) => {
  if (error || timeout) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-center text-white font-medium mb-4">
          {timeout ? timeoutMessage : errorMessage}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="bg-transparent border-white text-white hover:bg-white/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 backdrop-blur-sm z-10">
        <div className="w-2/3 max-w-xs space-y-3">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-foreground font-medium">
            {loadingMessage} {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ImageLoadingIndicator;
