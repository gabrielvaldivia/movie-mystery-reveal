
import { Movie } from '../types/movieTypes';
import { fetchPopularMovies } from '../services/tmdbService';

// TMDB API configuration
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"; // Medium size images

// Cache fetched movies here instead of using local collections
let cachedMovies: Movie[] = [];

// Get movies from TMDB API - limited to popular American movies
export const getMoviesCollection = async (): Promise<Movie[]> => {
  if (cachedMovies.length > 0) {
    console.log(`Using cached collection of ${cachedMovies.length} American movies`);
    return cachedMovies;
  }
  
  try {
    console.log("Fetching American movies collection from TMDB...");
    
    // Fetch 25 pages to get approximately 500 popular American movies (20 per page)
    const allMovies: Movie[] = [];
    const pagesToFetch = 25; // 25 pages * 20 movies = 500 movies
    
    for (let page = 1; page <= pagesToFetch; page++) {
      const pageMovies = await fetchPopularMovies(page);
      
      // Only add movies with posters
      const moviesWithPosters = pageMovies.filter(movie => !!movie.poster_path);
      allMovies.push(...moviesWithPosters);
      
      // Status update in console for debugging
      console.log(`Fetched page ${page}/${pagesToFetch}, got ${moviesWithPosters.length} valid American movies, total: ${allMovies.length}`);
      
      // If we already have enough movies, we can stop fetching
      if (allMovies.length >= 200) {
        console.log("Reached sufficient number of American movies, stopping fetch");
        break;
      }
    }
    
    cachedMovies = allMovies;
    console.log(`Total American movies in collection: ${cachedMovies.length}`);
    return cachedMovies;
  } catch (error) {
    console.error("Failed to fetch American movies collection:", error);
    throw error;
  }
};

// Legacy implementation for backward compatibility
export const moviesCollection: Movie[] = [];
