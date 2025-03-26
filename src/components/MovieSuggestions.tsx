
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandEmpty, CommandGroup, CommandItem } from './ui/command';

interface MovieSuggestionsProps {
  suggestions: Movie[];
  isOpen: boolean;
  onSelect: (title: string) => void;
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
    <div className="relative w-full">
      <div className="absolute top-1 left-0 right-0 z-50 overflow-hidden bg-white dark:bg-gray-800 rounded-md border shadow-lg">
        <Command className="w-full">
          <CommandGroup>
            {safeSuggestions.length > 0 ? (
              safeSuggestions.map((movie, index) => (
                <CommandItem
                  key={movie.id}
                  onSelect={() => onSelect(movie.title)}
                  className={`flex items-center py-2 px-3 cursor-pointer ${
                    index === highlightedIndex ? 'bg-accent' : ''
                  }`}
                >
                  <span className="truncate">{movie.title}</span>
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No movies found</CommandEmpty>
            )}
          </CommandGroup>
        </Command>
      </div>
    </div>
  );
};

export default MovieSuggestions;
