
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
    if (loadingProgress < 50) {
      return "Loading game assets...";
    } else if (loadingProgress < 95) {
      return "Preparing game content...";
    } else {
      return "Loading movie image...";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-b from-background/90 to-background">
      <div className="animate-pulse">
        <FilmIcon size={48} className="text-primary opacity-80" />
      </div>
      
      <div className="w-3/4 max-w-xs space-y-4">
        <Progress value={loadingProgress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          {getMessage()} {Math.round(loadingProgress)}%
        </p>
      </div>
      
      <div className="w-full max-w-sm space-y-3 mt-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

export default GameLoading;
