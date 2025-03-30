
import React from 'react';
import { Heart } from 'lucide-react';

interface GameStatsProps {
  lives: number;
  score: number;
  maxLives?: number;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  lives, 
  score, 
  maxLives = 10 
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-black/60 px-4 py-2 flex justify-between items-center">
      <div className="font-arcade text-white text-sm">
        Score: {score}
      </div>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxLives }).map((_, i) => (
          <Heart 
            key={i} 
            className={`h-4 w-4 ${i < lives ? 'text-primary fill-primary' : 'text-muted-foreground'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default GameStats;
