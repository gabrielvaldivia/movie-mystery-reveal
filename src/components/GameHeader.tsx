import React from "react";
import Timer from "./Timer";
import { Button } from "./ui/button";
import { SkipForward, X, Pause, Play, Heart } from "lucide-react";

interface GameHeaderProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onSkip: () => void;
  onClose: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onTimeUpdate?: (remainingMs: number) => void;
  lives: number;
  score: number;
  maxLives?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  duration,
  onTimeUp,
  isRunning,
  onSkip,
  onClose,
  isPaused = false,
  onTogglePause,
  onTimeUpdate,
  lives,
  score,
  maxLives = 10,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex flex-col">
      <Timer
        duration={duration}
        onTimeUp={onTimeUp}
        isRunning={isRunning && !isPaused}
        onTimeUpdate={onTimeUpdate}
      />

      <div className="relative h-16 flex justify-between items-center px-4">
        {/* Background gradient as a separate non-interactive element */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>

        <div className="font-arcade text-white text-sm pointer-events-auto z-10">
          Score: {score}
        </div>

        <div className="flex items-center gap-0.5 pointer-events-auto z-10">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={`h-4 w-4 ${
                i < lives ? "text-white fill-white" : "text-white"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 relative z-10 items-center">
          {onTogglePause && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePause}
              className="text-white rounded-full p-0 flex items-center justify-center h-4 w-4 hover:bg-transparent hover:text-white hover:opacity-100 hover:shadow-none hover:no-underline"
              aria-label={isPaused ? "Resume pixelation" : "Pause pixelation"}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="text-white rounded-full p-0 flex items-center justify-center h-4 w-4 hover:bg-transparent hover:text-white hover:opacity-100 hover:shadow-none hover:no-underline"
            aria-label="Skip this movie"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white rounded-full p-0 flex items-center justify-center h-4 w-4 hover:bg-transparent hover:text-white hover:opacity-100 hover:shadow-none hover:no-underline"
            aria-label="Close game"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
