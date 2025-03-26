
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { SkipForward, Clock } from 'lucide-react';
import { Movie } from '../utils/types/movieTypes';

interface SuccessDialogProps {
  isOpen: boolean;
  movie: Movie | null;
  onNextRound: () => void;
  timeTaken?: number; // Time taken in milliseconds
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ 
  isOpen, 
  movie, 
  onNextRound,
  timeTaken
}) => {
  if (!movie) return null;
  
  // Format time taken as seconds with one decimal place
  const formattedTime = timeTaken ? (timeTaken / 1000).toFixed(1) : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Correct! 🎉
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
          
          {formattedTime && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Guessed in {formattedTime}s</span>
            </div>
          )}
          
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
