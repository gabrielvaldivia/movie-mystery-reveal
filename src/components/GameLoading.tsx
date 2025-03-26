
import React from 'react';

interface GameLoadingProps {
  loadingProgress: number;
}

const GameLoading: React.FC<GameLoadingProps> = ({ loadingProgress }) => {
  return (
    <div className="w-full h-full glass-panel flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-opacity-20 absolute"></div>
        <div 
          className="w-16 h-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent absolute animate-spin"
          style={{ animationDuration: '1.5s' }}
        ></div>
      </div>
      <div className="w-3/4 max-w-xs">
        <div className="h-2 bg-secondary-foreground/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Loading game assets...
        </p>
      </div>
    </div>
  );
};

export default GameLoading;
