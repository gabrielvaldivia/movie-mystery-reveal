import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { LeaderboardEntry } from "../lib/supabase";

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, onClose }) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-8 flex flex-col items-center space-y-6 animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-arcade text-center tracking-wide">
            Leaderboard
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white rounded-full p-0 flex items-center justify-center h-8 w-8 hover:bg-transparent hover:text-white hover:opacity-100 hover:shadow-none hover:no-underline"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full space-y-2 max-h-[400px] overflow-y-auto">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className="flex justify-between items-center p-3 bg-card rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="font-arcade text-sm text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="font-arcade text-sm">{score.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-arcade text-sm text-primary">
                  {score.score}
                </span>
                <span className="font-arcade text-xs text-muted-foreground">
                  {new Date(score.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onClose}
          className="w-full px-8 py-6 text-lg font-arcade tracking-wide"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard;
