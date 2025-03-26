import React, { useEffect } from 'react';
import MovieGuessInput from './MovieGuessInput';
import NextRoundButton from './NextRoundButton';
import HintPopover from './HintPopover';
interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  hasIncorrectGuess?: boolean;
  onNextRound?: () => void;
  hint?: string;
}
const GuessInput: React.FC<GuessInputProps> = ({
  onGuess,
  disabled,
  isCorrect,
  correctAnswer,
  hasIncorrectGuess,
  onNextRound,
  hint
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
  return <div className="w-full space-y-4">
      {correctAnswer ? onNextRound && <NextRoundButton onNextRound={onNextRound} /> : <div className="relative flex items-center gap-2 backdrop-blur-sm bg-background/80 p-2 rounded-xl">
          {hint && <HintPopover hint={hint} />}
          
          <div className="flex-grow">
            <MovieGuessInput onGuess={onGuess} disabled={disabled} hasIncorrectGuess={hasIncorrectGuess} />
          </div>
        </div>}
    </div>;
};
export default GuessInput;