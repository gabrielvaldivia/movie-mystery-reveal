import { Movie } from '../types/movieTypes';
import { moviesCollection, TMDB_IMAGE_BASE_URL } from '../data/movieCollection';

// TMDB image sizes - try different sizes in case one works
const IMAGE_SIZES = ['w780', 'w500', 'w342', 'original'];

// Cache for valid URLs to avoid repeated HEAD requests
const validImageUrlCache = new Map<string, boolean>();

// Add a helper to check if an image URL is valid without causing browser errors
const isImageUrlValid = async (url: string): Promise<boolean> => {
  // Check the cache first
  if (validImageUrlCache.has(url)) {
    return validImageUrlCache.get(url) || false;
  }
  
  try {
    // Use a short timeout to avoid hanging on slow requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      // Avoid CORS issues with credentials
      credentials: 'omit',
      // Prevent browser caching
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    const isValid = response.ok;
    
    // Cache the result
    validImageUrlCache.set(url, isValid);
    return isValid;
  } catch (error) {
    console.warn(`Skipping image URL (may be CORS or network): ${url}`);
    validImageUrlCache.set(url, false);
    return false;
  }
};

// Try different image sizes until one works
const tryDifferentImageSizes = async (posterPath: string): Promise<string | null> => {
  if (!posterPath) return null;
  
  for (const size of IMAGE_SIZES) {
    const imageUrl = `${TMDB_IMAGE_BASE_URL}${size}${posterPath}`;
    if (await isImageUrlValid(imageUrl)) {
      return imageUrl;
    }
  }
  return null;
};

export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // Return existing valid image URL if available and already validated
    if (movie.imageUrl && validImageUrlCache.get(movie.imageUrl)) {
      return movie.imageUrl;
    }
    
    // If movie has a TMDB poster path, try different sizes
    if (movie.poster_path) {
      const validUrl = await tryDifferentImageSizes(movie.poster_path);
      if (validUrl) {
        return validUrl;
      }
    }
    
    // No valid image found, throw error to be handled by caller
    throw new Error(`No valid image source for movie: ${movie.title}`);
  } catch (error) {
    console.warn(`Error fetching image for ${movie.title}:`, error);
    throw error;
  }
};

// Cache for valid movies (ones we've checked have images)
const validMoviesCache: Movie[] = [];

// Load a movie with image, on-demand
export const getMovieWithImage = async (): Promise<Movie> => {
  // If we have previously validated movies, return a random one
  if (validMoviesCache.length > 10) {
    return validMoviesCache[Math.floor(Math.random() * validMoviesCache.length)];
  }
  
  // Otherwise, we need to find movies with valid images
  const shuffledMovies = [...moviesCollection].sort(() => Math.random() - 0.5);
  
  // Try to find a movie with a valid image
  for (const movie of shuffledMovies) {
    try {
      const imageUrl = await fetchMovieImages(movie);
      const movieWithImage = { ...movie, imageUrl };
      
      // Add to our valid movies cache if not already there
      if (!validMoviesCache.some(m => m.id === movie.id)) {
        validMoviesCache.push(movieWithImage);
      }
      
      return movieWithImage;
    } catch (error) {
      // Just skip this movie and try another
      continue;
    }
  }
  
  throw new Error("Could not find any movies with valid images");
};

// Get the list of movies we've validated have images
export const getValidMovies = (): Movie[] => {
  return validMoviesCache;
};
