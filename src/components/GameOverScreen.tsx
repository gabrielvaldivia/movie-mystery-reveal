
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface GameOverScreenProps {
  finalScore: number;
  onPlayAgain: () => void;
  onSubmitScore: (playerName: string) => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  finalScore, 
  onPlayAgain, 
  onSubmitScore 
}) => {
  const [playerName, setPlayerName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSubmitScore(playerName);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-8 flex flex-col items-center space-y-6 animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
        <h1 className="text-2xl font-arcade text-center tracking-wide">
          Game Over!
        </h1>
        
        <div className="w-full text-center">
          <h2 className="text-xl font-arcade text-center tracking-wide">Final Score</h2>
          <p className="text-4xl font-arcade text-primary mt-2">{finalScore}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="player-name" className="font-arcade text-sm block mb-2">
              Enter your name:
            </label>
            <Input
              id="player-name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="font-arcade text-sm"
              placeholder="YOUR NAME"
              maxLength={15}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full font-arcade text-sm tracking-wide"
            size="lg"
            disabled={!playerName.trim()}
          >
            Save Score
          </Button>
        </form>
        
        <Button 
          onClick={onPlayAgain} 
          variant="outline"
          className="w-full font-arcade text-sm tracking-wide"
          size="lg"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
