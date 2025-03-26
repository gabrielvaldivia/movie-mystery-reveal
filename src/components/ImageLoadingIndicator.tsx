
import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
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
  timeout,
  onRetry
}) => {
  if (error || timeout) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 backdrop-blur-sm">
        <AlertCircle className="w-10 h-10 text-destructive mb-2" />
        <p className="text-center text-destructive-foreground mb-3">
          {timeout ? "Image load timed out" : "Failed to load image"}
        </p>
        <Button onClick={onRetry} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
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
