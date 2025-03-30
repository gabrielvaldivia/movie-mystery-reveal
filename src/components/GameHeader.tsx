
import React from 'react';
import Timer from './Timer';
import { Button } from './ui/button';
import { SkipForward, X, Pause, Play } from 'lucide-react';

interface GameHeaderProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onSkip: () => void;
  onClose: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onTimeUpdate?: (remainingMs: number) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning, 
  onSkip,
  onClose,
  isPaused = false,
  onTogglePause,
  onTimeUpdate
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex flex-col">
      <Timer 
        duration={duration} 
        onTimeUp={onTimeUp} 
        isRunning={isRunning && !isPaused}
        onTimeUpdate={onTimeUpdate}
      />
      
      <div className="relative h-16 flex justify-end items-center px-4 py-4 pt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="relative z-10 flex gap-2">
          {onTogglePause && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onTogglePause}
              className="text-white rounded-full p-2 flex items-center justify-center hover:bg-white/20"
              aria-label={isPaused ? "Resume pixelation" : "Pause pixelation"}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSkip}
            className="text-white rounded-full p-2 flex items-center justify-center hover:bg-white/20"
            aria-label="Skip this movie"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white rounded-full p-2 flex items-center justify-center hover:bg-white/20"
            aria-label="Close game"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
