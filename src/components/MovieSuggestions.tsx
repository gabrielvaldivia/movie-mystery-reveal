
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Loader2 } from 'lucide-react';

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
  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  // Ensure suggestions is always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
  
  // Limit to 5 suggestions
  const limitedSuggestions = safeSuggestions.slice(0, 5);

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-gray-800 rounded-md border shadow-lg z-50">
      <Command className="w-full">
        <CommandList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
              <span>Loading suggestions...</span>
            </div>
          ) : (
            <>
              <CommandEmpty>No movies found</CommandEmpty>
              {limitedSuggestions.length > 0 && (
                <CommandGroup>
                  {limitedSuggestions.map((movie, index) => (
                    <CommandItem
                      key={movie.id}
                      onSelect={() => {
                        console.log(`Selected movie from dropdown: ${movie.title}`);
                        onSelect(movie);
                      }}
                      className={`flex items-center py-2 px-3 cursor-pointer ${
                        index === highlightedIndex ? 'bg-accent' : ''
                      }`}
                    >
                      <span className="truncate">{movie.title}</span>
                      {movie.releaseYear ? (
                        <span className="ml-2 text-xs text-muted-foreground">({movie.releaseYear})</span>
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
