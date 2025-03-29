import React, { useState, useRef, useEffect } from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Input } from './ui/input';
import MovieSuggestions from './MovieSuggestions';
import { searchMovies } from '@/utils/services/tmdbService';

interface MovieGuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  hasIncorrectGuess?: boolean;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

const MovieGuessInput: React.FC<MovieGuessInputProps> = ({ 
  onGuess, 
  disabled, 
  hasIncorrectGuess,
  onInputFocus,
  onInputBlur
}) => {
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInteractingWithSuggestions, setIsInteractingWithSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (guess.trim() && !disabled) {
      console.log("Submitting guess from form:", guess.trim());
      onGuess(guess.trim());
      setGuess(""); 
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuess(value);
    
    if (value.trim().length >= 2) {
      setIsLoading(true);
      try {
        const movieSuggestions = await searchMovies(value);
        setSuggestions(Array.isArray(movieSuggestions) ? movieSuggestions : []);
        setIsSuggestionsOpen(movieSuggestions && movieSuggestions.length > 0);
      } catch (error) {
        console.error('Error getting movie suggestions:', error);
        setSuggestions([]);
        setIsSuggestionsOpen(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
    setHighlightedIndex(-1);
  };

  const handleSuggestionSelect = (movie: Movie) => {
    console.log("Selected movie for submission:", movie.title);
    setGuess(movie.title);
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    
    // Immediately submit the guess
    if (!disabled) {
      onGuess(movie.title);
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
      if (suggestions[highlightedIndex]) {
        handleSuggestionSelect(suggestions[highlightedIndex]);
      }
    }
    else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleFocus = () => {
    if (onInputFocus) {
      onInputFocus();
    }
    
    if (guess.trim().length >= 2 && suggestions.length > 0) {
      setIsSuggestionsOpen(true);
    }
  };

  const handleBlur = () => {
    // Don't clear input if user is interacting with suggestions
    if (!isInteractingWithSuggestions) {
      setTimeout(() => {
        if (onInputBlur) {
          onInputBlur();
        }
        setIsSuggestionsOpen(false);
        setGuess("");
      }, 200);
    }
  };

  // Set up mouse event listeners for dropdown
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Check if the click is inside the suggestions dropdown
      if (suggestionsRef.current && suggestionsRef.current.contains(e.target as Node)) {
        setIsInteractingWithSuggestions(true);
      } else if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsInteractingWithSuggestions(false);
        setGuess("");
        setIsSuggestionsOpen(false);
      }
    };

    // Reset the interacting state on mouseup anywhere in the document
    const handleMouseUp = () => {
      setTimeout(() => {
        setIsInteractingWithSuggestions(false);
      }, 100);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow">
          {isSuggestionsOpen && (
            <div 
              ref={suggestionsRef}
              className="absolute bottom-full left-0 right-0 mb-1 z-50"
            >
              <MovieSuggestions 
                suggestions={suggestions}
                isOpen={isSuggestionsOpen}
                onSelect={handleSuggestionSelect}
                highlightedIndex={highlightedIndex}
                isLoading={isLoading}
              />
            </div>
          )}
          
          <Input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Guess the movie..."
            disabled={disabled}
            className={`w-full py-2 px-3 pr-10 text-xs tracking-tight ${
              hasIncorrectGuess 
                ? 'border-destructive ring-2 ring-destructive/50 shake-animation' 
                : ''
            }`}
          />
          <button
            type="submit"
            disabled={disabled || !guess.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-none bg-primary text-white border border-white/20 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] hover:translate-y-[1px] hover:shadow-none active:translate-y-[2px] disabled:opacity-30 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default MovieGuessInput;
