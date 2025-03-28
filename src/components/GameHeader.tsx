
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
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning, 
  onSkip,
  onClose,
  isPaused = false,
  onTogglePause
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4 pt-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="text-white transition-colors rounded-full p-0 flex items-center justify-center"
        aria-label="Close game"
        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
      >
        <X className="h-5 w-5" />
      </Button>
      
      <div className="w-full mx-8">
        <Timer 
          duration={duration} 
          onTimeUp={onTimeUp} 
          isRunning={isRunning && !isPaused} 
        />
      </div>
      
      <div className="flex gap-2">
        {onTogglePause && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onTogglePause}
            className="text-white transition-colors rounded-full p-0 flex items-center justify-center"
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
          className="text-white transition-colors rounded-full p-0 flex items-center justify-center"
          aria-label="Skip this movie"
          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default GameHeader;
