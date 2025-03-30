
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
    <div className="absolute top-0 left-0 right-0 z-10 flex flex-col">
      <Timer 
        duration={duration} 
        onTimeUp={onTimeUp} 
        isRunning={isRunning && !isPaused}
        onTimeUpdate={onTimeUpdate}
      />
      
      <div className="bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4 pt-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white rounded-full p-0 flex items-center justify-center hover:bg-transparent hover:text-white"
          aria-label="Close game"
          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-2">
          {onTogglePause && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onTogglePause}
              className="text-white rounded-full p-0 flex items-center justify-center hover:bg-transparent hover:text-white"
              aria-label={isPaused ? "Resume pixelation" : "Pause pixelation"}
              style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSkip}
            className="text-white rounded-full p-0 flex items-center justify-center hover:bg-transparent hover:text-white"
            aria-label="Skip this movie"
            style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
