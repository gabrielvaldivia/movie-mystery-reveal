import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { LeaderboardEntry, Difficulty } from "../lib/supabase";
import { leaderboardService } from "../services/leaderboardService";

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  onClose: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  scores: initialScores,
  onClose,
  difficulty,
  onDifficultyChange,
}) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>(initialScores);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const newScores = await leaderboardService.getTopScores(difficulty);
        setScores(newScores);
      } catch (error) {
        console.error("Error loading scores:", error);
      }
    };
    loadScores();
  }, [difficulty]);

  return (
    <div className="w-full max-w-md min-h-[600px] bg-[#1A2336] rounded-lg p-6">
      <div className="flex flex-col items-center gap-6 h-full">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-arcade text-[#ECAF31]">
            {difficulty === "easy" ? "Easy Mode" : "Hard Mode"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-[#ECAF31]" />
          </button>
        </div>

        <div className="flex bg-[#ECAF31]/10 rounded-lg p-1 w-full">
          <button
            onClick={() => onDifficultyChange("easy")}
            className={`flex-1 px-4 py-2 rounded-md font-arcade text-sm transition-colors ${
              difficulty === "easy"
                ? "bg-[#ECAF31] text-[#1A2336]"
                : "text-[#ECAF31]"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => onDifficultyChange("hard")}
            className={`flex-1 px-4 py-2 rounded-md font-arcade text-sm transition-colors ${
              difficulty === "hard"
                ? "bg-[#ECAF31] text-[#1A2336]"
                : "text-[#ECAF31]"
            }`}
          >
            Hard
          </button>
        </div>

        {scores.length > 0 ? (
          <div className="w-full space-y-2 flex-1">
            {scores.map((score, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
              >
                <span className="font-arcade text-[#ECAF31] text-sm">
                  {score.player_name}
                </span>
                <span className="font-arcade text-[#ECAF31] text-sm">
                  {score.score}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 flex-1 flex items-center justify-center">
            <p className="font-arcade text-[#ECAF31] text-sm">
              No scores yet. Be the first to play!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
