
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// TMDB image sizes
const BACKUP_IMAGE_SIZE = 'w500';
const PRIMARY_IMAGE_SIZE = 'w780';

// Public placeholder image as ultimate fallback
const PUBLIC_FALLBACK = 'https://placehold.co/600x900/222222/FFFFFF?text=Movie+Not+Found';

export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  // Return existing valid image URL if available
  if (movie.imageUrl && !movie.imageUrl.includes('tmdb.org') && !movie.imageUrl.includes('unsplash.com')) {
    return movie.imageUrl;
  }
  
  // If movie has a TMDB poster path, construct and return the URL
  if (movie.poster_path) {
    // Use a larger size by default
    return `https://image.tmdb.org/t/p/${PRIMARY_IMAGE_SIZE}${movie.poster_path}`;
  }
  
  // Return public fallback if no valid image sources are available
  return PUBLIC_FALLBACK;
};

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  try {
    // Process all movies and assign image URLs
    const updatedMovies = await Promise.all(
      moviesCollection.map(async (movie) => {
        try {
          const imageUrl = await fetchMovieImages(movie);
          return { ...movie, imageUrl };
        } catch (error) {
          console.error(`Failed to load image for ${movie.title}, using fallback`);
          return { ...movie, imageUrl: PUBLIC_FALLBACK };
        }
      })
    );
    
    moviesWithImages = updatedMovies;
    imagesLoaded = true;
    console.log("All movies loaded with images");
  } catch (err) {
    console.error("Error loading all movie images:", err);
    // Use fallback images if loading fails
    moviesWithImages = moviesCollection.map(movie => ({
      ...movie,
      imageUrl: PUBLIC_FALLBACK
    }));
    imagesLoaded = true;
  }
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};

// Get a backup image URL if primary URL fails
export const getBackupImageUrl = (movie: Movie): string => {
  if (movie.poster_path) {
    return `https://image.tmdb.org/t/p/${BACKUP_IMAGE_SIZE}${movie.poster_path}`;
  }
  return PUBLIC_FALLBACK;
};
