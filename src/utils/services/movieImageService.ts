
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

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
    const imageUrl = `https://image.tmdb.org/t/p/${size}${posterPath}`;
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

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [];
let imagesLoaded = false;
let loadAttempted = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded || loadAttempted) return;
  
  loadAttempted = true;
  
  try {
    console.log(`Attempting to load images for ${moviesCollection.length} movies...`);
    
    // Process all movies and assign image URLs with concurrency limit
    const results = [];
    const concurrencyLimit = 5; // Process 5 movies at a time to avoid overwhelming the network
    
    for (let i = 0; i < moviesCollection.length; i += concurrencyLimit) {
      const batch = moviesCollection.slice(i, i + concurrencyLimit);
      const batchResults = await Promise.all(
        batch.map(async (movie) => {
          try {
            const imageUrl = await fetchMovieImages(movie);
            console.log(`Successfully loaded image for ${movie.title}`);
            return { success: true, movie: { ...movie, imageUrl } };
          } catch (error) {
            console.error(`Failed to load image for ${movie.title}, skipping movie`);
            return { success: false, movie };
          }
        })
      );
      results.push(...batchResults);
    }
    
    // Filter out movies without valid images
    moviesWithImages = results
      .filter(result => result.success)
      .map(result => result.movie);
    
    imagesLoaded = moviesWithImages.length > 0;
    console.log(`Loaded ${moviesWithImages.length} movies with valid images`);
    
    if (moviesWithImages.length === 0) {
      console.error("No valid movie images were loaded. Game may not function properly.");
    }
  } catch (err) {
    console.error("Error loading all movie images:", err);
    throw err; // Propagate error to be handled by caller
  }
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};

// Function to reset the loading state and try again
export const resetImageLoading = (): void => {
  imagesLoaded = false;
  loadAttempted = false;
  moviesWithImages = [];
};
