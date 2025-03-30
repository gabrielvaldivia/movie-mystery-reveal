
import { Movie } from '../types/movieTypes';
import { getMoviesCollection } from '../data/movieCollection';
import { TMDB_IMAGE_BASE_URL } from '../services/tmdbService';

// TMDB image sizes - try different sizes in case one works
const IMAGE_SIZES = ['w780', 'w500', 'w342', 'original'];

// Add a helper to check if an image URL is valid
const isImageUrlValid = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Failed to validate image URL: ${url}`, error);
    return false;
  }
};

// Try different image sizes until one works
const tryDifferentImageSizes = async (posterPath: string): Promise<string | null> => {
  for (const size of IMAGE_SIZES) {
    const imageUrl = `${TMDB_IMAGE_BASE_URL.replace('w780', size)}${posterPath}`;
    if (await isImageUrlValid(imageUrl)) {
      return imageUrl;
    }
  }
  return null;
};

export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // Return existing valid image URL if available
    if (movie.imageUrl && await isImageUrlValid(movie.imageUrl)) {
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
    console.error(`Error fetching image for ${movie.title}:`, error);
    throw error;
  }
};

// Cache for valid movies (ones we've checked have images)
const validMovies: Movie[] = [];

// Load a movie with image, on-demand, randomizing selection from the entire collection
export const getMovieWithImage = async (): Promise<Movie> => {
  console.log("Getting movie with valid image...");
  
  // If we have previously validated movies, return a random one
  if (validMovies.length > 10) {
    const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)];
    console.log(`Using cached movie: "${randomMovie.title}" (${randomMovie.releaseYear})`);
    return randomMovie;
  }
  
  // Otherwise, we need to fetch movies from TMDB and find ones with valid images
  try {
    const moviesCollection = await getMoviesCollection();
    console.log(`Searching through ${moviesCollection.length} movies for valid images...`);
    
    // Shuffle the entire movie collection to ensure true randomness
    const shuffledMovies = [...moviesCollection].sort(() => Math.random() - 0.5);
    
    // Try to find a movie with a valid image
    for (const movie of shuffledMovies) {
      try {
        console.log(`Checking image for: "${movie.title}" (${movie.releaseYear})`);
        const imageUrl = await fetchMovieImages(movie);
        const movieWithImage = { ...movie, imageUrl };
        
        // Add to our valid movies cache if not already there
        if (!validMovies.some(m => m.id === movie.id)) {
          validMovies.push(movieWithImage);
        }
        
        console.log(`Found valid image for: "${movie.title}"`);
        return movieWithImage;
      } catch (error) {
        // Just skip this movie and try another
        console.log(`Skipping movie without valid image: ${movie.title}`);
        continue;
      }
    }
    
    throw new Error("Could not find any movies with valid images");
  } catch (error) {
    console.error("Error getting movie with image:", error);
    throw error;
  }
};

// Get the list of movies we've validated have images
export const getValidMovies = (): Movie[] => {
  return validMovies;
};
