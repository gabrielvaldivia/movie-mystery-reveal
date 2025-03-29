
import React from 'react';

interface NextRoundButtonProps {
  onNextRound: () => void;
}

const NextRoundButton: React.FC<NextRoundButtonProps> = ({ onNextRound }) => {
  return (
    <div className="animate-slide-up">
      <button
        id="next-round-button"
        onClick={onNextRound}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-primary/90 active:scale-[0.98] font-arcade text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
        </svg>
        <span>Next Round</span>
      </button>
    </div>
  );
};

export default NextRoundButton;
