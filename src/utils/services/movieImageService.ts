
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// Local fallback image (uploaded to the project)
const FALLBACK_IMAGE = '/lovable-uploads/7b774628-fcec-47de-8506-f083317dcfbc.png';
// Secondary image size in case the primary size fails
const SECONDARY_IMAGE_SIZE = 'w500';
const PRIMARY_IMAGE_SIZE = 'w780';

// Updated to use multiple TMDB image sizes and better error handling
export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // If movie already has an imageUrl that isn't from TMDB and is valid, use it
    if (movie.imageUrl && 
        !movie.imageUrl.includes('tmdb.org') && 
        !movie.imageUrl.includes('unsplash.com')) {
      console.log(`Using existing image URL: ${movie.imageUrl}`);
      return movie.imageUrl;
    }
    
    // Use movie poster_path if available (from the movie API)
    if (movie.poster_path) {
      // Try first with larger image size
      try {
        const primaryImageUrl = `https://image.tmdb.org/t/p/${PRIMARY_IMAGE_SIZE}${movie.poster_path}`;
        // Test if image loads
        await testImageLoad(primaryImageUrl);
        console.log(`Using TMDB primary image: ${primaryImageUrl}`);
        return primaryImageUrl;
      } catch (primaryError) {
        console.warn(`Primary image size failed, trying secondary: ${movie.title}`);
        
        // Try with smaller image size as fallback
        try {
          const secondaryImageUrl = `https://image.tmdb.org/t/p/${SECONDARY_IMAGE_SIZE}${movie.poster_path}`;
          await testImageLoad(secondaryImageUrl);
          console.log(`Using TMDB secondary image: ${secondaryImageUrl}`);
          return secondaryImageUrl;
        } catch (secondaryError) {
          console.error(`Both TMDB image sizes failed for: ${movie.title}`);
          throw new Error('Both image sizes failed');
        }
      }
    }
    
    // Use the local fallback image as last resort
    console.log(`Using fallback image for movie: ${movie.title}`);
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error with movie image:", error);
    return FALLBACK_IMAGE;
  }
};

// Helper function to test if an image loads
const testImageLoad = (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const testImage = new Image();
    testImage.onload = () => resolve();
    testImage.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    testImage.src = imageUrl;
    
    // Set a timeout to avoid long waits
    setTimeout(() => reject(new Error('Image load timeout')), 5000);
  });
};

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  // Attempt to load images from the movie API first
  try {
    const updatedMovies = await Promise.all(
      moviesCollection.map(async (movie) => {
        try {
          const imageUrl = await fetchMovieImages(movie);
          return { ...movie, imageUrl };
        } catch (error) {
          console.error(`Failed to load image for ${movie.title}, using fallback`);
          return { ...movie, imageUrl: FALLBACK_IMAGE };
        }
      })
    );
    
    moviesWithImages = updatedMovies;
    imagesLoaded = true;
    console.log("All movies loaded with images");
  } catch (err) {
    console.error("Error loading all movie images:", err);
    // Still populate with fallback images so the game can proceed
    moviesWithImages = moviesCollection.map(movie => ({
      ...movie,
      imageUrl: FALLBACK_IMAGE
    }));
    imagesLoaded = true;
  }
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};
