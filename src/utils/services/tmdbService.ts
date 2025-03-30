import { Movie, TMDbMovie, TMDbResponse } from '../types/movieTypes';

// The Movie Database API configuration
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

// Use a free API key for demo purposes
// In a production app, this should be stored securely
const TMDB_API_KEY = "2dca580c2a14b55200e784d157207b4d";

// Fetch popular movies from TMDB
export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    console.log(`Fetching popular American movies - page ${page}`);
    
    // Use region=US parameter to only get American movies
    // Add vote_count to ensure movies are well-known
    // Add vote_average for quality threshold
    // Add primary_release_date.gte for movies from 1970 onwards
    // Add with_original_language=en for English language films
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&region=US&with_original_language=en&vote_count.gte=1000&vote_average.gte=6.5&primary_release_date.gte=1970-01-01&sort_by=popularity.desc`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDbResponse = await response.json();
    console.log(`Received ${data.results.length} movies from page ${page}`);
    
    // Additional filter to make sure we're only getting US movies and they have all required data
    const usMovies = data.results.filter((movie: TMDbMovie) => {
      return movie.original_language === 'en' && 
             (!movie.origin_country || movie.origin_country.includes('US')) &&
             movie.poster_path &&  // Must have a poster
             movie.vote_count >= 1000 &&  // Additional check for vote count
             movie.vote_average >= 6.5 &&  // Additional check for rating
             movie.release_date;  // Must have a release date
    });
    
    console.log(`Filtered to ${usMovies.length} American movies from page ${page}`);
    
    // Map TMDB movie format to our app's Movie format
    return usMovies.map((movie: TMDbMovie) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: new Date(movie.release_date).getFullYear() || 0,
      tmdbId: movie.id,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count
    }));
  } catch (error) {
    console.error(`Error fetching popular movies (page ${page}):`, error);
    // Return empty array instead of throwing to handle individual page failures gracefully
    return [];
  }
};

// Search movies by title
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    // Add region=US parameter to only get American movies
    const response = await fetch(
      `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&region=US&with_original_language=en`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Additional filter for American movies
    const usMovies = data.results.filter((movie: any) => 
      movie.original_language === 'en' && 
      (!movie.origin_country || movie.origin_country.includes('US'))
    );
    
    return usMovies.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
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
      tmdbId: movie.id,
      poster_path: movie.poster_path
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};
