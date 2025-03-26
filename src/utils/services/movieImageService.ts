
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// Fallback images
const FALLBACK_IMAGES = [
  '/lovable-uploads/7b774628-fcec-47de-8506-f083317dcfbc.png',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1374&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1627483297886-49710ae1fc22?q=80&w=1530&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1450&auto=format&fit=crop'
];

// Get a random fallback image
const getRandomFallbackImage = (): string => {
  const index = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[index];
};

// Updated to always use fallback images since TMDB API is not working
export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // If movie already has an imageUrl that isn't from TMDB, use it
    if (movie.imageUrl && !movie.imageUrl.includes('tmdb.org')) {
      return movie.imageUrl;
    }
    
    // Use a random fallback image
    return getRandomFallbackImage();
  } catch (error) {
    console.error("Error with movie image:", error);
    return getRandomFallbackImage();
  }
};

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  // Assign fallback images to all movies
  const updatedMovies = await Promise.all(
    moviesCollection.map(async (movie, index) => {
      // Use a deterministic fallback image based on movie index
      const imageUrl = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
      return { ...movie, imageUrl };
    })
  );
  
  moviesWithImages = updatedMovies;
  imagesLoaded = true;
  console.log("All movies loaded with fallback images");
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};
