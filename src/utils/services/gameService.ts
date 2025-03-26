import { Movie } from '../types/movieTypes';
import { getMovieWithImage, getValidMovies } from './movieImageService';

// Keep track of the movies we've already shown to avoid repetition
const usedMovieIds = new Set<string>();

export const getRandomMovie = async (): Promise<Movie> => {
  try {
    // Get a random movie with a valid image
    const movie = await getMovieWithImage();
    usedMovieIds.add(movie.id);
    return movie;
  } catch (error) {
    console.error("Failed to get random movie:", error);
    throw error;
  }
};

export const getNextMovie = async (currentId: string): Promise<Movie> => {
  try {
    // Add current movie to used set if not already there
    if (currentId) {
      usedMovieIds.add(currentId);
    }
    
    // Try to find a movie that hasn't been used yet
    let attempts = 0;
    let nextMovie;
    
    do {
      nextMovie = await getMovieWithImage();
      attempts++;
      
      // If we've tried too many times or found an unused movie, break
      if (attempts > 10 || !usedMovieIds.has(nextMovie.id)) {
        break;
      }
    } while (nextMovie.id === currentId || usedMovieIds.has(nextMovie.id));
    
    // If we've shown all movies, reset the used set
    if (usedMovieIds.size > 30) {
      usedMovieIds.clear();
      if (currentId) {
        usedMovieIds.add(currentId);
      }
    }
    
    // Add this movie to used set
    usedMovieIds.add(nextMovie.id);
    return nextMovie;
  } catch (error) {
    console.error("Failed to get next movie:", error);
    throw error;
  }
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
