
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
    <div className="absolute top-0 left-0 right-0 z-10 flex flex-col">
      <Timer 
        duration={duration} 
        onTimeUp={onTimeUp} 
        isRunning={isRunning && !isPaused} 
      />
      
      <div className="bg-gradient-to-b from-black to-transparent h-16 flex justify-between items-center px-4 py-4 pt-6 border-b-2 border-[#33ff00]">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-[#33ff00] rounded-full p-0 flex items-center justify-center hover:bg-black/50 hover:text-[#ff00ff] border border-[#33ff00] hover:border-[#ff00ff] hover:shadow-[0_0_8px_#ff00ff]"
          aria-label="Close game"
          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </Button>
        
        <div className="flex gap-2">
          {onTogglePause && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onTogglePause}
              className="text-[#33ff00] rounded-full p-0 flex items-center justify-center hover:bg-black/50 hover:text-[#00ffff] border border-[#33ff00] hover:border-[#00ffff] hover:shadow-[0_0_8px_#00ffff]"
              aria-label={isPaused ? "Resume pixelation" : "Pause pixelation"}
              style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
            >
              {isPaused ? <Play className="h-5 w-5" strokeWidth={1.5} /> : <Pause className="h-5 w-5" strokeWidth={1.5} />}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSkip}
            className="text-[#33ff00] rounded-full p-0 flex items-center justify-center hover:bg-black/50 hover:text-[#ffff00] border border-[#33ff00] hover:border-[#ffff00] hover:shadow-[0_0_8px_#ffff00]"
            aria-label="Skip this movie"
            style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
          >
            <SkipForward className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
