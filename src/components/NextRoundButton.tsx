import React from "react";
import { RefreshCw } from "lucide-react";

interface NextRoundButtonProps {
  onNextRound: () => void;
}

const NextRoundButton: React.FC<NextRoundButtonProps> = ({ onNextRound }) => {
  return (
    <div className="animate-slide-up">
      <button
        id="next-round-button"
        onClick={onNextRound}
        className="w-full bg-white text-[#1A2336] py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-white/90 active:scale-[0.98] font-arcade text-sm"
      >
        <RefreshCw className="h-5 w-5" />
        <span>Next Round</span>
      </button>
    </div>
  );
};

export default NextRoundButton;
