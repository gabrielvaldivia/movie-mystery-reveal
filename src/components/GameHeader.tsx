
import React, { useState } from 'react';
import Timer from './Timer';
import { Button } from './ui/button';
import { Pause, Play, SkipForward } from 'lucide-react';

interface GameHeaderProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onSkip: () => void;
  onPauseToggle?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning, 
  onSkip,
  onPauseToggle
}) => {
  const [isPaused, setIsPaused] = useState(false);
  
  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    if (onPauseToggle) {
      onPauseToggle();
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4 pt-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handlePauseToggle}
        className="bg-black/30 text-white hover:bg-black/50 hover:text-white transition-colors rounded-full p-0 flex items-center justify-center"
        aria-label={isPaused ? "Resume game" : "Pause game"}
        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
      >
        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
      </Button>
      <div className="w-full mx-2">
        <Timer 
          duration={duration} 
          onTimeUp={onTimeUp} 
          isRunning={isRunning && !isPaused} 
        />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onSkip}
        className="bg-black/30 text-white hover:bg-black/50 hover:text-white transition-colors rounded-full p-0 flex items-center justify-center"
        aria-label="Skip this movie"
        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default GameHeader;
