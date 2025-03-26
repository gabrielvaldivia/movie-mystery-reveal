
import { Movie } from './types/movieTypes';
import { getMovieWithImage } from './services/movieImageService';
import { getMoviesCollection } from './data/movieCollection';

// Get a random movie with a valid image
export const getRandomMovie = async (): Promise<Movie> => {
  try {
    return await getMovieWithImage();
  } catch (error) {
    console.error("Error getting random movie:", error);
    throw error;
  }
};

// Get next movie, ensuring it's different from the current one
export const getNextMovie = async (currentMovieId: string): Promise<Movie> => {
  try {
    // Try up to 5 times to get a different movie
    for (let attempts = 0; attempts < 5; attempts++) {
      const nextMovie = await getMovieWithImage();
      if (nextMovie.id !== currentMovieId) {
        return nextMovie;
      }
    }
    
    // If we couldn't get a different movie after 5 attempts, just return any valid movie
    return await getMovieWithImage();
  } catch (error) {
    console.error("Error getting next movie:", error);
    throw error;
  }
};

// Get a collection of valid movies for use in game suggestions
export const getMovieSuggestions = async (currentMovieId: string): Promise<Movie[]> => {
  try {
    const allMovies = await getMoviesCollection();
    
    // Filter out the current movie
    const possibleMovies = allMovies.filter(movie => movie.id !== currentMovieId);
    
    // Shuffle and take the first 5
    return [...possibleMovies]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  } catch (error) {
    console.error("Error getting movie suggestions:", error);
    // Return empty array if we can't get suggestions
    return [];
  }
};
