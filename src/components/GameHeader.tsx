
import React from 'react';

interface GameHeaderProps {
  score: number;
  round: number;
  totalRounds: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, round, totalRounds }) => {
  return (
    <div className="w-full flex items-center justify-between mb-4">
      <div className="glass-panel px-4 py-2 rounded-full animate-fade-in">
        <span className="text-sm font-medium">Round {round}/{totalRounds}</span>
      </div>
      
      <div className="glass-panel px-4 py-2 rounded-full animate-fade-in animation-delay-200">
        <span className="text-sm font-medium">Score: <span className="font-bold">{score}</span></span>
      </div>
    </div>
  );
};

export default GameHeader;
