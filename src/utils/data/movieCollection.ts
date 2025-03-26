
import { Movie } from '../types/movieTypes';
import { fetchPopularMovies } from '../services/tmdbService';

// TMDB API configuration
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"; // Medium size images

// Cache fetched movies here instead of using local collections
let cachedMovies: Movie[] = [];

// Get movies from TMDB API - limited to top 500 popular movies
export const getMoviesCollection = async (): Promise<Movie[]> => {
  if (cachedMovies.length > 0) {
    return cachedMovies;
  }
  
  try {
    // Fetch 25 pages to get approximately 500 popular movies (20 per page)
    const allMovies: Movie[] = [];
    const pagesToFetch = 25; // 25 pages * 20 movies = 500 movies
    
    for (let page = 1; page <= pagesToFetch; page++) {
      const pageMovies = await fetchPopularMovies(page);
      allMovies.push(...pageMovies);
      
      // Status update in console for debugging
      console.log(`Fetched page ${page}/${pagesToFetch}, total movies: ${allMovies.length}`);
    }
    
    cachedMovies = allMovies;
    console.log(`Total movies in collection: ${cachedMovies.length}`);
    return cachedMovies;
  } catch (error) {
    console.error("Failed to fetch movies collection:", error);
    throw error;
  }
};

// Legacy implementation for backward compatibility
export const moviesCollection: Movie[] = [];
