
import React from 'react';
import Timer from './Timer';
import { Button } from './ui/button';
import { Pause, SkipForward } from 'lucide-react';

interface GameHeaderProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onSkip: () => void;
  onPause?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning, 
  onSkip,
  onPause
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onPause}
        className="bg-black/30 text-white hover:bg-black/50 transition-colors rounded-full w-10 h-10 flex items-center justify-center"
        aria-label="Pause game"
      >
        <Pause className="h-5 w-5" />
      </Button>
      <div className="w-full mx-2">
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
        className="bg-black/30 text-white hover:bg-black/50 transition-colors rounded-full w-10 h-10 flex items-center justify-center"
        aria-label="Skip this movie"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default GameHeader;
