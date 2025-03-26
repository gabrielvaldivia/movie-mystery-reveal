
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Movie } from '@/utils/types/movieTypes';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CorrectGuessDialogProps {
  open: boolean;
  movie: Movie | null;
  score: number;
  onClose: () => void;
  onNextMovie: () => void;
}

const CorrectGuessDialog: React.FC<CorrectGuessDialogProps> = ({
  open,
  movie,
  score,
  onClose,
  onNextMovie,
}) => {
  if (!movie) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-center">Correct!</h2>
          
          {/* Movie poster */}
          <div className="w-full max-w-xs overflow-hidden rounded-md">
            <AspectRatio ratio={2/3}>
              <img 
                src={movie.imageUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
          
          {/* Movie title */}
          <h3 className="text-xl font-bold text-center">{movie.title}</h3>
          
          {/* Score */}
          <div className="text-center">
            <p className="text-lg">You scored</p>
            <p className="text-3xl font-bold text-primary">{score} points</p>
          </div>
          
          {/* Next button */}
          <Button 
            onClick={onNextMovie} 
            className="w-full"
            size="lg"
          >
            Next Movie
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectGuessDialog;
