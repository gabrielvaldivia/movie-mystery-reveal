
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
        <img src="https://raster.saran13raj.com/icon/refresh" alt="Refresh" className="h-5 w-5" />
        <span>Next Round</span>
      </button>
    </div>
  );
};

export default NextRoundButton;
