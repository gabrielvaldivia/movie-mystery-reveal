
import { Movie } from '../types/movieTypes';

// The Movie Database API configuration
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

// Use a free API key for demo purposes
// In a production app, this should be stored securely
const TMDB_API_KEY = "2dca580c2a14b55200e784d157207b4d";

// Generate a more obscure hint that doesn't give away the movie
const generateObscureHint = (overview: string, title: string): string => {
  if (!overview || overview.trim() === '') {
    return "A mysterious film awaits your guess";
  }
  
  // Remove any direct mentions of the movie title from the overview
  const titleWords = title.toLowerCase().split(/\s+/);
  let sanitizedOverview = overview.toLowerCase();
  
  // Remove the title and any words from the title that are 4+ characters
  titleWords.forEach(word => {
    if (word.length >= 4) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      sanitizedOverview = sanitizedOverview.replace(regex, '...');
    }
  });
  
  // Get the first sentence that doesn't contain the movie title
  const sentences = overview.split('.');
  let hint = '';
  
  for (const sentence of sentences) {
    if (sentence.trim().length > 15) { // Ensure sentence has reasonable length
      const lowerSentence = sentence.toLowerCase();
      let containsTitle = false;
      
      // Check if sentence contains any significant words from title
      titleWords.forEach(word => {
        if (word.length >= 4 && lowerSentence.includes(word.toLowerCase())) {
          containsTitle = true;
        }
      });
      
      if (!containsTitle) {
        hint = sentence.trim();
        break;
      }
    }
  }
  
  // If we couldn't find a good sentence, use a cryptic hint based on themes
  if (!hint) {
    // Extract some keywords from the overview
    const words = overview.split(/\s+/);
    const keywords = words.filter(word => 
      word.length > 5 && 
      !titleWords.some(titleWord => word.toLowerCase().includes(titleWord.toLowerCase()))
    ).slice(0, 3);
    
    if (keywords.length > 0) {
      hint = `Themes include: ${keywords.join(', ')}`;
    } else {
      hint = `A film from ${new Date(movie.release_date).getFullYear()}`;
    }
  }
  
  return hint;
};

// Fetch popular movies from TMDB
export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    console.log(`Fetching popular American movies - page ${page}`);
    
    // Use region=US parameter to only get American movies
    // Also add 'with_original_language=en' to further filter for English language films
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&region=US&with_original_language=en`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received ${data.results.length} movies from page ${page}`);
    
    // Additional filter to make sure we're only getting US movies (some might slip through)
    const usMovies = data.results.filter((movie: any) => {
      return movie.original_language === 'en' && 
             (!movie.origin_country || movie.origin_country.includes('US'));
    });
    
    console.log(`Filtered to ${usMovies.length} American movies from page ${page}`);
    
    // Map TMDB movie format to our app's Movie format
    return usMovies.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: new Date(movie.release_date).getFullYear() || 0,
      hint: generateObscureHint(movie.overview, movie.title), // Generate obscure hint
      tmdbId: movie.id,
      poster_path: movie.poster_path
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
      hint: generateObscureHint(movie.overview, movie.title), // Generate obscure hint
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
      hint: generateObscureHint(movie.overview, movie.title), // Generate obscure hint
      tmdbId: movie.id,
      poster_path: movie.poster_path
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};
