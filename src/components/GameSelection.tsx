
import React from 'react';
import { Button } from './ui/button';
import { FilmIcon, BookText } from 'lucide-react';

interface GameSelectionProps {
  onSelectGame: (gameType: 'movie' | 'flicktionary') => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-gradient-to-b from-background to-secondary/50 rounded-lg">
      <h1 className="text-4xl font-bold mb-8">Choose Your Game</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="flex flex-col items-center">
          <Button 
            size="lg" 
            onClick={() => onSelectGame('movie')}
            className="w-full px-8 py-8 text-lg font-semibold flex flex-col items-center gap-4 h-auto"
          >
            <FilmIcon size={48} />
            <span>Movie Mystery</span>
          </Button>
          <p className="mt-4 text-muted-foreground">
            Guess the movie as it gradually reveals itself
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => onSelectGame('flicktionary')}
            className="w-full px-8 py-8 text-lg font-semibold flex flex-col items-center gap-4 h-auto"
          >
            <BookText size={48} />
            <span>Flicktionary</span>
          </Button>
          <p className="mt-4 text-muted-foreground">
            Guess words from their definitions
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
