
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
    <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center h-16 px-4 py-2 bg-gradient-to-b from-black/60 to-transparent">
      <div className="font-arcade text-white text-sm">
        Score: {score}
      </div>
      
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxLives }).map((_, i) => (
          <Heart 
            key={i} 
            className={`h-4 w-4 ${i < lives ? 'text-white fill-white' : 'text-muted-foreground'}`} 
          />
        ))}
      </div>
      
      <div className="w-[80px]"></div> {/* Empty space to balance the layout */}
    </div>
  );
};

export default GameStats;
