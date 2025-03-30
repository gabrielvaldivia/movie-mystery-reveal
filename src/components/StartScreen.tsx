import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Leaderboard from "./Leaderboard";
import { leaderboardService } from "../services/leaderboardService";
import { LeaderboardEntry } from "../lib/supabase";

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const topScores = await leaderboardService.getTopScores();
      setScores(topScores);
    } catch (error) {
      console.error("Error loading scores:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-[#1A2336] rounded-lg">
      <div className="mb-8 relative">
        <img
          src="/flicktionary-logo.png"
          alt="Flicktionary Logo"
          className="w-96 h-96 object-contain animate-in fade-in-0 slide-in-from-bottom-5 duration-500"
        />
      </div>
      <h1 className="text-3xl font-arcade mb-6 tracking-wider text-[#ECAF31]">
        Flicktionary
      </h1>
      <p className="text-[#ECAF31] mb-10 max-w-md font-arcade text-xs leading-relaxed tracking-wide">
        Guess the movie as it gradually reveals itself. The faster you guess,
        the higher your score.
      </p>
      <div className="space-y-3 w-full max-w-xs">
        <Button
          size="lg"
          onClick={onStartGame}
          className="w-full px-8 py-6 text-lg font-arcade tracking-wide bg-[#ECAF31] text-[#1A2336] hover:bg-[#ECAF31]/90"
        >
          Start Game
        </Button>
        <Button
          size="lg"
          onClick={() => setShowLeaderboard(true)}
          className="w-full px-8 py-6 text-lg font-arcade tracking-wide text-[#ECAF31] border border-[#ECAF31] bg-transparent"
        >
          Leaderboard
        </Button>
      </div>

      {showLeaderboard && (
        <Leaderboard
          scores={scores}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};

export default StartScreen;
