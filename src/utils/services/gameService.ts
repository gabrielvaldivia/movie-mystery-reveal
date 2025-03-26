
import { Movie } from '../types/movieTypes';
import { getMovieWithImage, getValidMovies } from './movieImageService';

export const getRandomMovie = async (): Promise<Movie> => {
  // Get a random movie with a valid image
  const movie = await getMovieWithImage();
  return movie;
};

export const getNextMovie = async (currentId: string): Promise<Movie> => {
  // Get a completely random movie that's different from the current one
  let nextMovie;
  
  do {
    nextMovie = await getMovieWithImage();
  } while (nextMovie.id === currentId);
  
  return nextMovie;
};

// Function to get movie suggestions based on user input
export const getMovieSuggestions = (query: string): Movie[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase().trim();
  const validMovies = getValidMovies();
  
  // Filter movies that match the query
  const matchingMovies = validMovies.filter(movie => 
    movie && movie.title && movie.title.toLowerCase().includes(lowercaseQuery)
  );
  
  // Limit the number of suggestions to avoid overwhelming the UI
  return matchingMovies.slice(0, 5);
};
