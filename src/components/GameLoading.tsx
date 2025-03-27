
import React from 'react';
import { Progress } from './ui/progress';
import { FilmIcon } from 'lucide-react';

interface GameLoadingProps {
  loadingProgress: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ loadingProgress }) => {
  // Simple static message instead of dynamic updates
  const message = "Loading game...";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-6 bg-background">
      <FilmIcon size={48} className="text-primary" />
      
      <div className="w-3/4 max-w-xs space-y-4">
        <Progress 
          value={loadingProgress} 
          className="h-2"
        />
        <p className="text-center text-sm text-muted-foreground">
          {message} {Math.round(loadingProgress)}%
        </p>
      </div>
    </div>
  );
};

export default GameLoading;
