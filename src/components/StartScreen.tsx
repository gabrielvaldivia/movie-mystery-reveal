
import React from 'react';
import { Button } from './ui/button';
import { FilmIcon } from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-gradient-to-b from-background to-secondary/50 rounded-lg">
      <div className="mb-8 text-primary">
        <FilmIcon size={64} />
      </div>
      <h1 className="text-3xl font-arcade mb-6 tracking-wider">Movie Mystery</h1>
      <p className="text-muted-foreground mb-10 max-w-md font-arcade text-xs leading-relaxed tracking-wide">
        Test your movie knowledge! Guess the movie as it gradually reveals itself. 
        The faster you guess, the higher your score.
      </p>
      <Button 
        size="lg" 
        onClick={onStartGame}
        className="px-8 py-6 text-lg font-arcade tracking-wide"
      >
        Start Game
      </Button>
    </div>
  );
};

export default StartScreen;
