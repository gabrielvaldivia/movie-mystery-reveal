import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FilmIcon } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-gradient-to-b from-background to-secondary/50 rounded-lg">
      <div className="mb-8 text-primary">
        <FilmIcon size={64} />
      </div>
      <h1 className="text-3xl font-arcade mb-6 tracking-wider">Flicktionary</h1>
      <p className="text-muted-foreground mb-10 max-w-md font-arcade text-xs leading-relaxed tracking-wide">
        Guess the movie as it gradually reveals itself. The faster you guess,
        the higher your score.
      </p>
      <div className="space-y-3 w-full max-w-xs">
        <Button
          size="lg"
          onClick={onStartGame}
          className="w-full px-8 py-6 text-lg font-arcade tracking-wide"
        >
          Start Game
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowLeaderboard(true)}
          className="w-full px-8 py-6 text-lg font-arcade tracking-wide"
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
