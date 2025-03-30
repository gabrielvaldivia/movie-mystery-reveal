import React from "react";
import { SkipForward, Play, Pause, X } from "lucide-react";

interface GameControlsProps {
  onSkip: () => void;
  onPause: () => void;
  onClose: () => void;
  isPaused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onSkip,
  onPause,
  onClose,
  isPaused,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSkip}
        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Skip movie"
      >
        <SkipForward className="h-6 w-6" />
      </button>
      <button
        onClick={onPause}
        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label={isPaused ? "Resume game" : "Pause game"}
      >
        {isPaused ? (
          <Play className="h-6 w-6" />
        ) : (
          <Pause className="h-6 w-6" />
        )}
      </button>
      <button
        onClick={onClose}
        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close game"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

export default GameControls;
