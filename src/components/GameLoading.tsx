
import React from 'react';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { FilmIcon } from 'lucide-react';

interface GameLoadingProps {
  loadingProgress: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ loadingProgress }) => {
  // Change the message based on the loading stage
  const getMessage = () => {
    if (loadingProgress < 30) {
      return "Initializing game...";
    } else if (loadingProgress < 60) {
      return "Loading game assets...";
    } else if (loadingProgress < 85) {
      return "Preparing movie data...";
    } else {
      return "Almost ready...";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-b from-background/90 to-background">
      <div className="animate-pulse">
        <FilmIcon size={48} className="text-primary opacity-80" />
      </div>
      
      <div className="w-3/4 max-w-xs space-y-4">
        <Progress 
          value={loadingProgress} 
          className="h-2"
          indicatorClassName="bg-primary/90 transition-all duration-500" 
        />
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          {getMessage()} {Math.round(loadingProgress)}%
        </p>
      </div>
      
      <div className="w-full max-w-sm space-y-3 mt-8">
        <Skeleton className="h-4 w-full animate-pulse" />
        <Skeleton className="h-4 w-3/4 animate-pulse" />
        <Skeleton className="h-4 w-1/2 animate-pulse" />
      </div>
    </div>
  );
};

export default GameLoading;
