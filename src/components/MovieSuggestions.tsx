
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandLoading } from './ui/command';
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

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-gray-800 rounded-md border shadow-lg">
      <Command className="w-full">
        <CommandList>
          {isLoading ? (
            <CommandLoading>
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                <span>Loading suggestions...</span>
              </div>
            </CommandLoading>
          ) : (
            <>
              <CommandEmpty>No movies found</CommandEmpty>
              {safeSuggestions.length > 0 && (
                <CommandGroup>
                  {safeSuggestions.map((movie, index) => (
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
