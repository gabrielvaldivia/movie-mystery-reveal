
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';

interface MovieSuggestionsProps {
  suggestions: Movie[];
  isOpen: boolean;
  onSelect: (movie: Movie) => void;
  highlightedIndex: number;
  isLoading?: boolean;
}

const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({
  suggestions,
  isOpen,
  onSelect,
  highlightedIndex,
  isLoading = false,
}) => {
  if (!isOpen) {
    return null;
  }

  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const limitedSuggestions = safeSuggestions.slice(0, 5);

  const handleSelect = (movie: Movie) => {
    console.log(`Movie suggestion clicked: ${movie.title}`);
    onSelect(movie); // Direct call without any delay
  };

  return (
    <div 
      className="w-full overflow-hidden bg-background border-2 border-primary/80 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] z-50"
      onMouseDown={(e) => {
        // Prevent the blur event on the input field
        e.preventDefault();
      }}
    >
      <Command className="w-full border-none rounded-none">
        <CommandList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6 font-arcade text-xs">
              <img 
                src="https://raster.saran13raj.com/icon/loading" 
                alt="Loading" 
                className="h-4 w-4 animate-spin text-primary mr-2" 
              />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <CommandEmpty className="font-arcade text-xs py-4">No movies found</CommandEmpty>
              {limitedSuggestions.length > 0 && (
                <CommandGroup>
                  {limitedSuggestions.map((movie, index) => (
                    <CommandItem
                      key={movie.id}
                      onSelect={() => handleSelect(movie)}
                      className={`flex items-center py-2 px-3 cursor-pointer font-arcade text-xs tracking-tight ${
                        index === highlightedIndex ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      data-testid={`movie-suggestion-${movie.id}`}
                    >
                      <span className="truncate">{movie.title}</span>
                      {movie.releaseYear ? (
                        <span className="ml-2 text-[8px] text-muted-foreground">({movie.releaseYear})</span>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

export default MovieSuggestions;
