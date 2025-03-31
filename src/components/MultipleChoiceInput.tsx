import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import FloatingScore from "./FloatingScore";

interface MultipleChoiceInputProps {
  options: string[];
  onGuess: (guess: string) => void;
  disabled: boolean;
  correctAnswer?: string;
  hasIncorrectGuess: boolean;
  onNextRound: () => void;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  options,
  onGuess,
  disabled,
  correctAnswer,
  hasIncorrectGuess,
  onNextRound,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [scorePosition, setScorePosition] = useState({ x: 0, y: 0 });

  // Handle transition to next round after showing color change
  useEffect(() => {
    if (selectedOption && correctAnswer) {
      const timer = setTimeout(() => {
        onNextRound();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, correctAnswer, onNextRound]);

  const handleButtonClick = (option: string, event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setScorePosition({
      x: rect.left + rect.width / 2 - 20,
      y: rect.top - 40,
    });
    setSelectedOption(option);
    onGuess(option);
    if (option === correctAnswer) {
      setShowScore(true);
      setTimeout(() => setShowScore(false), 1500);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      {showScore && correctAnswer === selectedOption && (
        <FloatingScore score={100} position={scorePosition} />
      )}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 max-w-xl mx-auto w-full">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={(e) => handleButtonClick(option, e)}
            disabled={disabled || selectedOption !== null}
            className={`
              font-arcade text-[10px] py-2 px-2 h-auto min-h-[3rem] flex items-center justify-center
              ${
                selectedOption === option
                  ? option === correctAnswer
                    ? "bg-green-500 hover:bg-green-500 opacity-100"
                    : "bg-red-500 hover:bg-red-500 opacity-100"
                  : "bg-[#ECAF31] text-[#1A2336] hover:bg-[#ECAF31]/90"
              }
              ${hasIncorrectGuess && "animate-shake"}
              disabled:opacity-100
            `}
          >
            <div className="max-h-[3em] leading-[1.5] overflow-hidden relative w-full">
              <span className="block text-center whitespace-normal">
                {option}
              </span>
              {option.length > 30 && (
                <span className="absolute bottom-0 right-0 bg-[#ECAF31]">
                  ...
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceInput;
