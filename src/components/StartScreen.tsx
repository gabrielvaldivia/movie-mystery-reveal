
import React from 'react';
import { Button } from './ui/button';
import { GamepadIcon } from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-black text-[#33ff00] border-4 border-[#33ff00] rounded-lg shadow-[0_0_15px_#33ff00]">
      <div className="mb-8 text-[#33ff00] animate-pulse">
        <GamepadIcon size={64} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-pixel mb-8 tracking-wider uppercase">Movie Mystery</h1>
      <div className="bg-black border-2 border-[#33ff00] p-5 mb-8 max-w-md shadow-[0_0_10px_#33ff00] rounded-md">
        <p className="font-pixel text-sm text-[#33ff00] leading-relaxed">
          Test your movie knowledge! Guess the movie as it gradually reveals itself. 
          The faster you guess, the higher your score.
        </p>
      </div>
      <button 
        onClick={onStartGame}
        className="py-4 px-8 bg-black text-[#33ff00] border-2 border-[#33ff00] font-pixel uppercase tracking-wider shadow-[0_0_10px_#33ff00] hover:bg-[#111] hover:shadow-[0_0_15px_#33ff00] transition-all duration-300 rounded-md"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
