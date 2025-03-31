import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Leaderboard from "./Leaderboard";
import { leaderboardService } from "../services/leaderboardService";
import { LeaderboardEntry, Difficulty } from "../lib/supabase";

interface StartScreenProps {
  onStartGame: (difficulty: Difficulty) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("easy");
  const [leaderboardDifficulty, setLeaderboardDifficulty] =
    useState<Difficulty>("easy");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Selected difficulty changed to:", selectedDifficulty);
  }, [selectedDifficulty]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    loadScores();
  }, [selectedDifficulty]);

  useEffect(() => {
    if (showLeaderboard) {
      loadLeaderboardScores();
    }
  }, [showLeaderboard, leaderboardDifficulty]);

  const loadScores = async () => {
    try {
      const topScores = await leaderboardService.getTopScores(
        selectedDifficulty
      );
      setScores(topScores);
    } catch (error) {
      console.error("Error loading scores:", error);
    }
  };

  const loadLeaderboardScores = async () => {
    try {
      const topScores = await leaderboardService.getTopScores(
        leaderboardDifficulty
      );
      setScores(topScores);
    } catch (error) {
      console.error("Error loading leaderboard scores:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
        setSelectedDifficulty((prev) => (prev === "easy" ? "hard" : "easy"));
        break;
      case "Enter":
        onStartGame(selectedDifficulty);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-between w-full h-full p-6 text-center bg-[#1A2336] rounded-lg outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <style>
        {`
          @keyframes floatLeftRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-4px); }
          }
          .hand-float {
            animation: floatLeftRight 1s ease-in-out infinite;
          }
        `}
      </style>

      <div className="flex-none py-8">
        <div className="flex justify-center mb-4 md:mb-8">
          <img
            src="/flicktionary-logo.png"
            alt="Flicktionary Logo"
            className="w-56 h-56 md:w-64 md:h-64 object-contain animate-in fade-in-0 slide-in-from-bottom-5 duration-500"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-arcade mb-4 md:mb-6 tracking-wider text-[#ECAF31]">
          Flicktionary
        </h1>
        <p className="text-[#ECAF31] mb-8 md:mb-10 max-w-md font-arcade text-xs leading-relaxed tracking-wide">
          Guess the movie as it gradually reveals itself. The faster you guess,
          the higher your score.
        </p>
      </div>

      <div className="flex-1" />

      <div className="flex-none relative space-y-6 w-full max-w-[500px]">
        <div className="relative">
          <div className="absolute left-4 w-6 pt-2">
            <div className="hand-float">
              <img
                src="/hand.png"
                alt="selector"
                className={`w-6 h-6 transition-transform duration-200 ${
                  selectedDifficulty === "hard"
                    ? "translate-y-[3.5rem]"
                    : "translate-y-0"
                }`}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Button
              className={`w-full pl-16 pr-4 p-2 h-auto font-arcade text-[#ECAF31] text-lg justify-start bg-transparent hover:bg-white/5 ${
                selectedDifficulty === "easy" ? "opacity-100" : "opacity-70"
              }`}
              onClick={() => {
                console.log("Setting difficulty to easy");
                setSelectedDifficulty("easy");
              }}
            >
              <span className="pl-14">Easy</span>
            </Button>
            <Button
              className={`w-full pl-16 pr-4 p-2 h-auto font-arcade text-[#ECAF31] text-lg justify-start bg-transparent hover:bg-white/5 ${
                selectedDifficulty === "hard" ? "opacity-100" : "opacity-70"
              }`}
              onClick={() => {
                console.log("Setting difficulty to hard");
                setSelectedDifficulty("hard");
              }}
            >
              <span className="pl-14">Hard</span>
            </Button>
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => onStartGame(selectedDifficulty)}
          className="w-full px-4 py-4 text-sm font-arcade tracking-wide bg-[#ECAF31] text-[#1A2336] hover:bg-[#ECAF31]/90 border-2 border-black"
        >
          Start Game
        </Button>

        <Button
          size="lg"
          onClick={() => setShowLeaderboard(true)}
          className="w-full px-4 py-4 text-sm font-arcade tracking-wide text-[#ECAF31] bg-transparent border-2 border-[#ECAF31] outline outline-2 outline-black"
        >
          Leaderboard
        </Button>
      </div>

      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Leaderboard
            scores={scores}
            onClose={() => setShowLeaderboard(false)}
            difficulty={leaderboardDifficulty}
            onDifficultyChange={setLeaderboardDifficulty}
          />
        </div>
      )}
    </div>
  );
};

export default StartScreen;
