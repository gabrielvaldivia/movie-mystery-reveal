
import React, { useEffect } from 'react';
import MovieGuessInput from './MovieGuessInput';
import NextRoundButton from './NextRoundButton';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  hasIncorrectGuess?: boolean;
  onNextRound?: () => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

const GuessInput: React.FC<GuessInputProps> = ({
  onGuess,
  disabled,
  isCorrect,
  correctAnswer,
  hasIncorrectGuess,
  onNextRound,
  onInputFocus,
  onInputBlur
}) => {
  // Focus the next round button when correct answer is shown
  useEffect(() => {
    if (correctAnswer && onNextRound) {
      const timeout = setTimeout(() => {
        const nextButton = document.getElementById("next-round-button");
        if (nextButton) {
          nextButton.focus();
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [correctAnswer, onNextRound]);

  // Direct pass-through of the onGuess function
  const handleGuess = (guess: string) => {
    console.log("GuessInput passing through guess:", guess);
    onGuess(guess);
  };

  return (
    <div className="w-full space-y-4">
      {correctAnswer ? (
        onNextRound && <NextRoundButton onNextRound={onNextRound} />
      ) : (
        <div className="relative flex items-center gap-2">
          <div className="flex-grow">
            <MovieGuessInput 
              onGuess={handleGuess} 
              disabled={disabled} 
              hasIncorrectGuess={hasIncorrectGuess}
              onInputFocus={onInputFocus}
              onInputBlur={onInputBlur}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessInput;
