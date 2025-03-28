
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, ArrowRight } from 'lucide-react';

interface WordGuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  hasIncorrectGuess?: boolean;
  correctAnswer?: string;
  onNextRound?: () => void;
}

const WordGuessInput: React.FC<WordGuessInputProps> = ({
  onGuess,
  disabled,
  hasIncorrectGuess,
  correctAnswer,
  onNextRound
}) => {
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current && !disabled && !correctAnswer) {
      inputRef.current.focus();
    }
  }, [disabled, correctAnswer]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || disabled) return;
    
    onGuess(guess);
    setGuess('');
  };
  
  if (correctAnswer) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">
            {correctAnswer && <span>The word was: <strong>{correctAnswer}</strong></span>}
          </p>
          
          {onNextRound && (
            <Button
              id="next-round-button"
              onClick={onNextRound}
              className="w-full py-6 text-lg"
            >
              Next Word <ArrowRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex gap-2 transition-all ${hasIncorrectGuess ? 'animate-shake' : ''}`}>
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter the word..."
            disabled={disabled}
            className={`pr-10 py-6 text-lg ${hasIncorrectGuess ? 'border-red-500' : ''}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={disabled || !guess.trim()} 
          className="py-6 px-8"
        >
          Guess
        </Button>
      </div>
    </form>
  );
};

export default WordGuessInput;
