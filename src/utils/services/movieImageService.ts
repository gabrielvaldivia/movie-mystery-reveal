
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// Local fallback image (uploaded to the project)
const FALLBACK_IMAGE = '/lovable-uploads/7b774628-fcec-47de-8506-f083317dcfbc.png';

// Updated to use only the movie API or local fallback image
export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // If movie already has an imageUrl that isn't from Unsplash, use it
    if (movie.imageUrl && !movie.imageUrl.includes('unsplash.com')) {
      return movie.imageUrl;
    }
    
    // Use movie poster_path if available (from the movie API)
    if (movie.poster_path) {
      const baseUrl = 'https://image.tmdb.org/t/p/w500';
      return `${baseUrl}${movie.poster_path}`;
    }
    
    // Use the local fallback image as last resort
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
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};
