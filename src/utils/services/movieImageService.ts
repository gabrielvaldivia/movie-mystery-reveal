
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// TMDB image size - use one high quality size only
const PRIMARY_IMAGE_SIZE = 'w780';

export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  // Return existing valid image URL if available
  if (movie.imageUrl && !movie.imageUrl.includes('tmdb.org') && !movie.imageUrl.includes('unsplash.com')) {
    return movie.imageUrl;
  }
  
  // If movie has a TMDB poster path, construct and return the URL
  if (movie.poster_path) {
    return `https://image.tmdb.org/t/p/${PRIMARY_IMAGE_SIZE}${movie.poster_path}`;
  }
  
  // No valid image found, throw error to be handled by caller
  throw new Error(`No valid image source for movie: ${movie.title}`);
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
