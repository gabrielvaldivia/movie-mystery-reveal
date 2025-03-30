import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

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

  // Handle transition to next round after showing color change
  useEffect(() => {
    if (selectedOption && correctAnswer) {
      const timer = setTimeout(() => {
        onNextRound();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, correctAnswer, onNextRound]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto w-full">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => {
              setSelectedOption(option);
              onGuess(option);
            }}
            disabled={disabled || selectedOption !== null}
            className={`
              font-arcade text-sm py-6 px-4 truncate
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
            <span className="block truncate">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceInput;
