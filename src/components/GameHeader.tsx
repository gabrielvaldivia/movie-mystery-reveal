
import React from 'react';
import Timer from './Timer';
import { Button } from './ui/button';

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
      
      <div className="bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4 pt-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white rounded-full p-0 flex items-center justify-center hover:bg-transparent hover:text-white"
          aria-label="Close game"
          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
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
              {isPaused ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              }
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
