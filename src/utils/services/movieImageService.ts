
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// TMDB image sizes from largest to smallest for fallback
const IMAGE_SIZES = ['w780', 'w500', 'w342', 'w185', 'w154', 'w92'];

export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  // Return existing valid image URL if available and not from TMDB or unsplash
  if (movie.imageUrl && !movie.imageUrl.includes('tmdb.org') && !movie.imageUrl.includes('unsplash.com')) {
    return movie.imageUrl;
  }
  
  // If movie has a TMDB poster path, try different sizes
  if (movie.poster_path) {
    // Try each size until one works
    for (const size of IMAGE_SIZES) {
      const imageUrl = `https://image.tmdb.org/t/p/${size}${movie.poster_path}`;
      try {
        // Test if the image loads
        await testImageUrl(imageUrl);
        console.log(`Loaded image for ${movie.title} at size ${size}`);
        return imageUrl;
      } catch (error) {
        console.warn(`Failed to load ${size} image for ${movie.title}, trying next size...`);
        continue;
      }
    }
  }
  
  // No valid image found, throw error to be handled by caller
  throw new Error(`No valid image source for movie: ${movie.title}`);
};

// Helper function to test if an image URL is valid
const testImageUrl = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
    
    // Add a timeout to avoid hanging indefinitely
    setTimeout(() => reject(new Error('Image load timed out')), 5000);
  });
};

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  try {
    // Process all movies and assign image URLs
    const validMovies = await Promise.all(
      moviesCollection.map(async (movie) => {
        try {
          const imageUrl = await fetchMovieImages(movie);
          return { success: true, movie: { ...movie, imageUrl } };
        } catch (error) {
          console.error(`Failed to load image for ${movie.title}, skipping movie`);
          return { success: false, movie };
        }
      })
    );
    
    // Filter out movies without valid images
    moviesWithImages = validMovies
      .filter(result => result.success)
      .map(result => result.movie);
    
    imagesLoaded = true;
    console.log(`Loaded ${moviesWithImages.length} movies with valid images`);
  } catch (err) {
    console.error("Error loading all movie images:", err);
    throw err; // Propagate error to be handled by caller
  }
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};
