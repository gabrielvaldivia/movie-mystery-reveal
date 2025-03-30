import { Movie } from '../types/movieTypes';
import { getMoviesCollection } from '../data/movieCollection';
import { fetchMovieImages } from './movieImageService';

// Keep track of available and used movies for the current game session
let availableMovies: Movie[] = [];
let usedMovies: Movie[] = [];

// Initialize or reset the movie pools
export const resetMoviePools = async (): Promise<void> => {
  try {
    // Get fresh collection of movies
    const allMovies = await getMoviesCollection();
    
    // Shuffle the movies for random initial order
    availableMovies = [...allMovies].sort(() => Math.random() - 0.5);
    usedMovies = [];
    
    console.log(`Reset movie pools: ${availableMovies.length} available, 0 used`);
  } catch (error) {
    console.error("Error resetting movie pools:", error);
    throw error;
  }
};

// Get the next movie, ensuring no repeats until all movies are used
export const getNextGameMovie = async (): Promise<Movie> => {
  try {
    // If we're out of available movies, reset by moving all used movies back
    if (availableMovies.length === 0) {
      console.log("All movies used, reshuffling the pool");
      availableMovies = [...usedMovies].sort(() => Math.random() - 0.5);
      usedMovies = [];
    }
    
    // Keep trying movies until we find one with a valid image
    while (availableMovies.length > 0) {
      // Take the next movie from the available pool
      const nextMovie = availableMovies.pop()!;
      
      try {
        // Verify the movie has a valid image
        const imageUrl = await fetchMovieImages(nextMovie);
        const movieWithImage = { ...nextMovie, imageUrl };
        
        // Add to used movies pool
        usedMovies.push(movieWithImage);
        
        console.log(`Selected movie: "${movieWithImage.title}" (${movieWithImage.releaseYear})`);
        console.log(`Movies remaining in pool: ${availableMovies.length}`);
        
        return movieWithImage;
      } catch (error) {
        // If image validation fails, skip this movie
        console.log(`Skipping movie without valid image: ${nextMovie.title}`);
        continue;
      }
    }
    
    throw new Error("No valid movies available");
  } catch (error) {
    console.error("Error getting next game movie:", error);
    throw error;
  }
};

// Get current game statistics
export const getGameMovieStats = (): { available: number; used: number } => {
  return {
    available: availableMovies.length,
    used: usedMovies.length
  };
}; 