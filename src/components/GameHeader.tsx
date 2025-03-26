
import React from 'react';
import Timer from './Timer';
import { Button } from './ui/button';
import { SkipForward, X } from 'lucide-react';

interface GameHeaderProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onSkip: () => void;
  onClose: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  duration, 
  onTimeUp, 
  isRunning, 
  onSkip,
  onClose
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4 pt-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="bg-black/30 text-white hover:bg-black/50 hover:text-white transition-colors rounded-full p-0 flex items-center justify-center"
        aria-label="Close game"
        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
      >
        <X className="h-5 w-5" />
      </Button>
      
      <div className="w-full mx-2">
        <Timer 
          duration={duration} 
          onTimeUp={onTimeUp} 
          isRunning={isRunning} 
        />
      </div>
      
      <Button 
        variant="default" 
        size="icon" 
        onClick={onSkip}
        className="bg-primary text-white hover:bg-primary/90 hover:text-white transition-colors rounded-full p-0 flex items-center justify-center"
        aria-label="Skip this movie"
        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
      >
        <SkipForward className="h-5 w-5" fill="currentColor" />
      </Button>
    </div>
  );
};

export default GameHeader;
