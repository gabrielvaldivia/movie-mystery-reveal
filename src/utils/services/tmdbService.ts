
import { Movie } from '../types/movieTypes';

// The Movie Database API configuration
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

// Use a free API key for demo purposes
// In a production app, this should be stored securely
const TMDB_API_KEY = "2dca580c2a14b55200e784d157207b4d";

// Fetch popular movies from TMDB
export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map TMDB movie format to our app's Movie format
    return data.results.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: new Date(movie.release_date).getFullYear() || 0,
      hint: movie.overview.split('.')[0], // Use first sentence of overview as hint
      tmdbId: movie.id,
      poster_path: movie.poster_path
    }));
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

// Search movies by title
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      hint: movie.overview ? movie.overview.split('.')[0] : "No hint available",
      tmdbId: movie.id,
      poster_path: movie.poster_path
    }));
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId: string): Promise<Movie> => {
  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const movie = await response.json();
    
    return {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      hint: movie.overview ? movie.overview.split('.')[0] : "No hint available",
      tmdbId: movie.id,
      poster_path: movie.poster_path
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};
