
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
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
  if (!movie) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {timeExpired ? "Time's Up!" : "Correct! 🎉"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full relative overflow-hidden">
            <img 
              src={movie.imageUrl} 
              alt={movie.title} 
              className="w-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-center">{movie.title}</h2>
          <p className="text-muted-foreground text-center">{movie.releaseYear}</p>
          
          <Button 
            onClick={onNextRound} 
            className="w-full mt-4"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Next Movie
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
