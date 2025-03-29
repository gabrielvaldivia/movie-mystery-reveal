
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface NextRoundButtonProps {
  onNextRound: () => void;
}

const NextRoundButton: React.FC<NextRoundButtonProps> = ({ onNextRound }) => {
  return (
    <div className="animate-slide-up">
      <button
        id="next-round-button"
        onClick={onNextRound}
        className="w-full bg-black text-[#33ff00] py-3 px-4 rounded-md flex items-center justify-center gap-2 border-2 border-[#33ff00] font-pixel text-sm uppercase tracking-wider shadow-[0_0_8px_#33ff00] hover:shadow-[0_0_12px_#33ff00] hover:bg-[#111] transition-all duration-300"
      >
        <RefreshCw className="h-5 w-5" strokeWidth={1.5} />
        <span>Next Round</span>
      </button>
    </div>
  );
};

export default NextRoundButton;
