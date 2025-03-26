
import React from 'react';
import Timer from './Timer';
import { Button } from './ui/button';
import { SkipForward } from 'lucide-react';

interface GameHeaderProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onSkip: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning, 
  onSkip 
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-2">
      <div className="w-full mr-2">
        <Timer 
          duration={duration} 
          onTimeUp={onTimeUp} 
          isRunning={isRunning} 
        />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onSkip}
        className="bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Skip this movie"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default GameHeader;
