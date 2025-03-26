
import React from 'react';
import { Button } from './ui/button';
import { SkipForward, AlarmClock } from 'lucide-react';
import { Movie } from '../utils/types/movieTypes';

interface SuccessDialogProps {
  isOpen: boolean;
  movie: Movie | null;
  onNextRound: () => void;
  timeExpired?: boolean;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ 
  isOpen, 
  movie, 
  onNextRound,
  timeExpired = false
}) => {
  if (!isOpen || !movie) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {timeExpired ? "Time's Up!" : "Correct! 🎉"}
        </h1>
        
        <div className="w-full aspect-[3/5] relative overflow-hidden rounded-lg shadow-lg">
          <img 
            src={movie.imageUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">{movie.title}</h2>
          <p className="text-muted-foreground">{movie.releaseYear}</p>
        </div>
        
        <Button 
          onClick={onNextRound} 
          className="w-full mt-8"
          size="lg"
        >
          <SkipForward className="mr-2 h-5 w-5" />
          Next Movie
        </Button>
      </div>
    </div>
  );
};

export default SuccessDialog;
