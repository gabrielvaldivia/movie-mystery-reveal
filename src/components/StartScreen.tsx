
import React from 'react';
import { Button } from './ui/button';
import { GalleryHorizontalEnd } from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-gradient-to-b from-background to-secondary/50 rounded-lg">
      <div className="mb-8 text-primary">
        <GalleryHorizontalEnd size={64} />
      </div>
      <h1 className="text-4xl font-bold mb-4">Movie Mystery</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Test your movie knowledge! Guess the movie as it gradually reveals itself. 
        The faster you guess, the higher your score.
      </p>
      <Button 
        size="lg" 
        onClick={onStartGame}
        className="px-8 py-6 text-lg font-semibold"
      >
        Start Game
      </Button>
    </div>
  );
};

export default StartScreen;
