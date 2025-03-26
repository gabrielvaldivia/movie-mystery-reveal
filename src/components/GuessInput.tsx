
import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, SkipForward } from 'lucide-react';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  isCorrect?: boolean;
  correctAnswer?: string;
  onNextRound?: () => void;
  onSkip?: () => void;
}

const GuessInput: React.FC<GuessInputProps> = ({ 
  onGuess, 
  disabled, 
  isCorrect, 
  correctAnswer,
  onNextRound,
  onSkip
}) => {
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onGuess(guess.trim());
    }
  };

  // Focus input on mount and when disabled state changes
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // If correctAnswer is shown, focus the next button
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

  return (
    <div className="w-full space-y-4">
      {correctAnswer ? (
        <div className="animate-slide-up">
          <div className={`text-center p-3 rounded-lg ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <p className="font-medium">
              {isCorrect ? 'Correct!' : 'Time\'s up!'}
            </p>
            <p className="text-sm mt-1">
              The movie was <span className="font-semibold">{correctAnswer}</span>
            </p>
          </div>
          {onNextRound && (
            <button
              id="next-round-button" 
              onClick={onNextRound}
              className="w-full mt-4 bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Next Round</span>
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Guess the movie..."
              disabled={disabled}
              className="w-full py-3 px-4 pr-12 bg-white rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={disabled || !guess.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white opacity-90 hover:opacity-100 disabled:opacity-30 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={disabled}
              className="w-full py-2 px-4 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center gap-2 transition-all hover:bg-secondary/80 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <SkipForward className="h-4 w-4" />
              <span>Skip</span>
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default GuessInput;
