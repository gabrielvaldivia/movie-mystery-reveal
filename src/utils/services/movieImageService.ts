
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// Local fallback image (uploaded to the project)
const FALLBACK_IMAGE = '/lovable-uploads/7b774628-fcec-47de-8506-f083317dcfbc.png';

// TMDB image base URLs for different sizes
export const TMDB_IMAGE_SIZES = {
  small: 'w342',
  medium: 'w500',
  large: 'w780',
  original: 'original'
};

// Updated to be more robust with image loading
export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // If movie already has an imageUrl that isn't from TMDB, use it
    if (movie.imageUrl && !movie.imageUrl.includes('image.tmdb.org')) {
      console.log(`Using existing image URL: ${movie.imageUrl}`);
      return movie.imageUrl;
    }
    
    // Use movie poster_path if available (from the movie API)
    if (movie.poster_path) {
      // Try different sizes in case one fails
      const baseUrl = 'https://image.tmdb.org/t/p/';
      // Start with w500 but can be configured to use different sizes
      const size = TMDB_IMAGE_SIZES.medium;
      const imageUrl = `${baseUrl}${size}${movie.poster_path}`;
      console.log(`Using TMDB image (${size}): ${imageUrl}`);
      return imageUrl;
    }
    
    // Use the local fallback image as last resort
    console.log(`Using fallback image for movie: ${movie.title}`);
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error with movie image:", error);
    return FALLBACK_IMAGE;
  }
};

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  try {
    // Attempt to load images from the movie API first
    const updatedMovies = await Promise.all(
      moviesCollection.map(async (movie) => {
        const imageUrl = await fetchMovieImages(movie);
        return { ...movie, imageUrl };
      })
    );
    
    moviesWithImages = updatedMovies;
    imagesLoaded = true;
    console.log("All movies loaded with API images or local fallback");
  } catch (error) {
    console.error("Error loading all movie images:", error);
    // In case of error, still populate with original movies
    moviesWithImages = [...moviesCollection];
    imagesLoaded = true;
  }
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};

// Function to force-retry loading a specific movie image
export const retryMovieImage = async (movie: Movie): Promise<string> => {
  try {
    // Clear any cached URL
    const movieToRetry = { ...movie };
    
    // If it's a TMDB URL, try a different size
    if (movie.imageUrl && movie.imageUrl.includes('image.tmdb.org') && movie.poster_path) {
      const baseUrl = 'https://image.tmdb.org/t/p/';
      // Try a different size this time
      const size = movie.imageUrl.includes('w500') ? 
        TMDB_IMAGE_SIZES.small : 
        movie.imageUrl.includes('w780') ? 
          TMDB_IMAGE_SIZES.medium : 
          TMDB_IMAGE_SIZES.original;
      
      movieToRetry.imageUrl = `${baseUrl}${size}${movie.poster_path}`;
      console.log(`Retrying with different size (${size}): ${movieToRetry.imageUrl}`);
    } else {
      // If not a TMDB URL or no poster_path, reset to force refetch
      movieToRetry.imageUrl = '';
    }
    
    // Refetch the image
    const newImageUrl = await fetchMovieImages(movieToRetry);
    
    // Update the cached movie if it exists
    if (imagesLoaded) {
      moviesWithImages = moviesWithImages.map(m => 
        m.id === movie.id ? { ...m, imageUrl: newImageUrl } : m
      );
    }
    
    return newImageUrl;
  } catch (error) {
    console.error("Error retrying movie image:", error);
    return FALLBACK_IMAGE;
  }
};
