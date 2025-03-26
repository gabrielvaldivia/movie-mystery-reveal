
import React, { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { FilmIcon } from 'lucide-react';

interface GameLoadingProps {
  loadingProgress: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ loadingProgress }) => {
  const [message, setMessage] = useState("Initializing game...");
  
  // Update message more responsively based on progress
  useEffect(() => {
    if (loadingProgress < 20) {
      setMessage("Initializing game...");
    } else if (loadingProgress < 40) {
      setMessage("Loading game assets...");
    } else if (loadingProgress < 60) {
      setMessage("Connecting to movie database...");
    } else if (loadingProgress < 80) {
      setMessage("Preparing movie data...");
    } else {
      setMessage("Almost ready...");
    }
  }, [loadingProgress]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-b from-background/90 to-background">
      <div className="animate-pulse animate-bounce">
        <FilmIcon size={48} className="text-primary opacity-90" />
      </div>
      
      <div className="w-3/4 max-w-xs space-y-4">
        <Progress 
          value={loadingProgress} 
          className="h-2"
          indicatorClassName="bg-primary/90 transition-all duration-150" 
        />
        <p className="text-center text-sm text-muted-foreground">
          {message} {Math.round(loadingProgress)}%
        </p>
      </div>
      
      <div className="w-full max-w-sm space-y-3 mt-6">
        <Skeleton className="h-4 w-full animate-pulse" />
        <Skeleton className="h-4 w-3/4 animate-pulse" />
        <Skeleton className="h-4 w-1/2 animate-pulse" />
      </div>
    </div>
  );
};

export default GameLoading;
