
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandGroup, CommandItem } from './ui/command';

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
  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="absolute top-1 left-0 right-0 z-50 overflow-hidden bg-white dark:bg-gray-800 rounded-md border shadow-lg">
        <Command className="w-full">
          <CommandGroup>
            {suggestions.map((movie, index) => (
              <CommandItem
                key={movie.id}
                onSelect={() => onSelect(movie.title)}
                className={`flex items-center py-2 px-3 cursor-pointer ${
                  index === highlightedIndex ? 'bg-accent' : ''
                }`}
              >
                <span className="truncate">{movie.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </div>
    </div>
  );
};

export default MovieSuggestions;
