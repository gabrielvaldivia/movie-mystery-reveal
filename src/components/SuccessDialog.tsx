
import React from 'react';
import { Button } from './ui/button';
import { Movie } from '../utils/types/movieTypes';

interface SuccessDialogProps {
  isOpen: boolean;
  movie: Movie | null;
  onNextRound: () => void;
  timeExpired?: boolean;
  score?: number; 
  totalScore?: number;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ 
  isOpen, 
  movie, 
  onNextRound,
  timeExpired = false,
  score = 0,
  totalScore = 0
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

        {!timeExpired && (
          <div className="flex flex-col items-center space-y-1 w-full bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between w-full">
              <p className="font-medium">This round:</p>
              <p className="font-bold">{score} / 100</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="font-medium">Total score:</p>
              <p className="font-bold">{totalScore}</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={onNextRound} 
          className="w-full mt-6"
          size="lg"
        >
          Next Movie
        </Button>
      </div>
    </div>
  );
};

export default SuccessDialog;
