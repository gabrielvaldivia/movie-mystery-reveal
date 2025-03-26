
import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import MovieSuggestions from './MovieSuggestions';
import { Movie } from '@/utils/types/movieTypes';
import { getMovieSuggestions } from '@/utils/services/gameService';

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
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onGuess(guess.trim());
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  };

  const handleNextRound = () => {
    setGuess("");
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    if (onNextRound) {
      onNextRound();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuess(value);
    
    if (value.trim().length >= 2) {
      try {
        const movieSuggestions = getMovieSuggestions(value);
        setSuggestions(Array.isArray(movieSuggestions) ? movieSuggestions : []);
        setIsSuggestionsOpen(movieSuggestions && movieSuggestions.length > 0);
      } catch (error) {
        console.error('Error getting movie suggestions:', error);
        setSuggestions([]);
        setIsSuggestionsOpen(false);
      }
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
    setHighlightedIndex(-1);
  };

  const handleSuggestionSelect = (title: string) => {
    setGuess(title);
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSuggestionsOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : 0
      );
    }
    else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      if (suggestions[highlightedIndex] && suggestions[highlightedIndex].title) {
        handleSuggestionSelect(suggestions[highlightedIndex].title);
      }
    }
    else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

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
          {onNextRound && (
            <button
              id="next-round-button" 
              onClick={handleNextRound}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Next Round</span>
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center gap-2 backdrop-blur-sm bg-background/80 rounded-lg p-2">
            {hint && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="flex-shrink-0 bg-white/90 hover:bg-white"
                    aria-label="Show hint"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit min-w-[200px] p-3">
                  <p className="text-sm font-medium">Hint: {hint}</p>
                </PopoverContent>
              </Popover>
            )}
            
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                value={guess}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Guess the movie..."
                disabled={disabled}
                className={`w-full py-2 px-3 pr-10 bg-white/90 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all ${
                  hasIncorrectGuess 
                    ? 'border-destructive ring-2 ring-destructive/50 shake-animation' 
                    : 'border-input'
                }`}
              />
              <button
                type="submit"
                disabled={disabled || !guess.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white opacity-90 hover:opacity-100 disabled:opacity-30 transition-opacity"
              >
                <Send className="h-3 w-3" />
              </button>
              
              <MovieSuggestions 
                suggestions={suggestions}
                isOpen={isSuggestionsOpen}
                onSelect={handleSuggestionSelect}
                highlightedIndex={highlightedIndex}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default GuessInput;
