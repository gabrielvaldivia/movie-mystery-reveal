
import React from 'react';
import { Movie } from '@/utils/types/movieTypes';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';

interface MovieSuggestionsProps {
  suggestions: Movie[];
  isOpen: boolean;
  onSelect: (title: string) => void;
  highlightedIndex: number;
  onSubmit: () => void; 
}

const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({
  suggestions,
  isOpen,
  onSelect,
  highlightedIndex,
  onSubmit,
}) => {
  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  // Ensure suggestions is always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  return (
    <div className="relative w-full">
      <div className="absolute bottom-full left-0 right-0 z-50 mb-11 overflow-hidden bg-white dark:bg-gray-800 rounded-md border shadow-lg">
        <Command className="w-full">
          <CommandList>
            <CommandEmpty>No movies found</CommandEmpty>
            {safeSuggestions.length > 0 && (
              <CommandGroup>
                {safeSuggestions.map((movie, index) => (
                  <CommandItem
                    key={movie.id}
                    onSelect={() => {
                      // Call onSelect directly with the movie title
                      onSelect(movie.title);
                      // Call onSubmit to close the dropdown after selection
                      if (onSubmit) onSubmit();
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
    </div>
  );
};

export default MovieSuggestions;
