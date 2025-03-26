
import { Movie } from '../types/movieTypes';
import { loadAllMovieImages, getLoadedMovies } from './movieImageService';

export const getRandomMovie = async (): Promise<Movie> => {
  await loadAllMovieImages();
  
  const moviesWithImages = getLoadedMovies();
  const randomIndex = Math.floor(Math.random() * moviesWithImages.length);
  return moviesWithImages[randomIndex];
};

export const getNextMovie = async (currentId: string): Promise<Movie> => {
  await loadAllMovieImages();
  
  const moviesWithImages = getLoadedMovies();
  
  // Get a completely random movie that's different from the current one
  let randomIndex;
  let nextMovie;
  
  do {
    randomIndex = Math.floor(Math.random() * moviesWithImages.length);
    nextMovie = moviesWithImages[randomIndex];
  } while (nextMovie.id === currentId && moviesWithImages.length > 1);
  
  return nextMovie;
};

// New function to get movie suggestions based on user input
export const getMovieSuggestions = (query: string): Movie[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase().trim();
  const moviesWithImages = getLoadedMovies();
  
  // Filter movies that match the query
  const matchingMovies = moviesWithImages.filter(movie => 
    movie.title.toLowerCase().includes(lowercaseQuery)
  );
  
  // Limit the number of suggestions to avoid overwhelming the UI
  return matchingMovies.slice(0, 5);
};
