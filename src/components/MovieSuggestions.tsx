
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';

interface MovieSuggestionsProps {
  suggestions: Movie[];
  isOpen: boolean;
  onSelect: (movie: Movie) => void;
  highlightedIndex: number;
}

const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({
  suggestions,
  isOpen,
  onSelect,
  highlightedIndex,
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
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

export default MovieSuggestions;
