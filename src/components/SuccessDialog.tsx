
import React from 'react';
import { Button } from './ui/button';
import { SkipForward } from 'lucide-react';
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
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-8 flex flex-col items-center space-y-6 animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
        <h1 className="text-3xl font-bold text-center">
          {timeExpired ? "Time's Up!" : "Correct! 🎉"}
        </h1>
        
        <div className="w-full relative overflow-hidden rounded-lg shadow-lg">
          <img 
            src={movie.imageUrl} 
            alt={movie.title} 
            className="w-full h-auto object-cover aspect-[3/4] rounded-lg"
          />
        </div>
        
        <div className="flex flex-col items-center space-y-3 w-full">
          <h2 className="text-2xl font-bold text-center">{movie.title}</h2>
          <p className="text-muted-foreground text-center">{movie.releaseYear}</p>
        </div>
        
        <Button 
          onClick={onNextRound} 
          className="w-full mt-6"
          size="lg"
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Next Movie
        </Button>
      </div>
    </div>
  );
};

export default SuccessDialog;
