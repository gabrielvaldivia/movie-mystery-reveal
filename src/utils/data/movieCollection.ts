
import { Movie } from '../types/movieTypes';
import { fetchPopularMovies } from '../services/tmdbService';

// TMDB API configuration
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"; // Medium size images

// Cache fetched movies here instead of using local collections
let cachedMovies: Movie[] = [];

// Get movies from TMDB API
export const getMoviesCollection = async (): Promise<Movie[]> => {
  if (cachedMovies.length > 0) {
    return cachedMovies;
  }
  
  try {
    // Fetch multiple pages to get a good selection of movies
    const page1 = await fetchPopularMovies(1);
    const page2 = await fetchPopularMovies(2);
    const page3 = await fetchPopularMovies(3);
    
    cachedMovies = [...page1, ...page2, ...page3];
    return cachedMovies;
  } catch (error) {
    console.error("Failed to fetch movies collection:", error);
    throw error;
  }
};

// Legacy implementation for backward compatibility
export const moviesCollection: Movie[] = [];
