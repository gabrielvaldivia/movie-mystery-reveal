
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface ImageLoadingIndicatorProps {
  isLoading: boolean;
  progress: number;
  error: boolean;
  timeout: boolean;
  onRetry: () => void;
}

const ImageLoadingIndicator: React.FC<ImageLoadingIndicatorProps> = ({
  isLoading,
  progress,
  error,
  timeout
}) => {
  if (error || timeout) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-center text-white font-medium mb-4">
          {timeout ? "Image load timed out" : "Failed to load image"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 backdrop-blur-sm">
        <div className="w-2/3 max-w-xs space-y-2">
          <Progress value={progress} className="h-1.5" />
          <p className="text-center text-xs text-muted-foreground">
            Loading movie image...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ImageLoadingIndicator;
