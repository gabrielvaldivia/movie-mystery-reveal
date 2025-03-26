
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Movie } from '@/utils/types/movieTypes';
import { getMovieSuggestions } from '@/utils/services/gameService';
import { Input } from './ui/input';

interface MovieGuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  hasIncorrectGuess?: boolean;
}

const MovieGuessInput: React.FC<MovieGuessInputProps> = ({ 
  onGuess, 
  disabled, 
  hasIncorrectGuess 
}) => {
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (guess.trim() && !disabled) {
      console.log("Submitting guess from form:", guess.trim());
      onGuess(guess.trim());
      setGuess(""); // Clear input after submission
      setSuggestions([]);
      setIsSuggestionsOpen(false);
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

  const handleSuggestionSelect = (movie: Movie) => {
    console.log("Selected movie:", movie.title);
    // Update the state
    setGuess(movie.title);
    // Close suggestions
    setIsSuggestionsOpen(false);
    
    // Give React a chance to update the DOM
    setTimeout(() => {
      // Focus the input after selection
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
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
      if (suggestions[highlightedIndex]) {
        handleSuggestionSelect(suggestions[highlightedIndex]);
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
  
  // This effect runs when guess changes from external updates (like suggestion selection)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== guess) {
      inputRef.current.value = guess;
    }
  }, [guess]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Guess the movie..."
            disabled={disabled}
            className={`w-full py-2 px-3 pr-10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all ${
              hasIncorrectGuess 
                ? 'border-destructive ring-2 ring-destructive/50 shake-animation' 
                : ''
            }`}
          />
          <button
            type="submit"
            disabled={disabled || !guess.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white opacity-90 hover:opacity-100 disabled:opacity-30 transition-opacity"
          >
            <Send className="h-3 w-3" />
          </button>
          
          {isSuggestionsOpen && (
            <MovieSuggestions 
              suggestions={suggestions}
              isOpen={isSuggestionsOpen}
              onSelect={handleSuggestionSelect}
              highlightedIndex={highlightedIndex}
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default MovieGuessInput;
