
import { Movie } from '../types/movieTypes';
import { moviesCollection } from '../data/movieCollection';

// Since the API key is invalid, we'll use the backup image URLs directly
// This function no longer attempts to fetch from TMDB
export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    // Return the backup image URL that's already provided in the movie object
    if (movie.imageUrl) {
      return movie.imageUrl;
    }
    
    // Fallback image if no backup image URL is available
    return "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop";
  } catch (error) {
    console.error("Error with movie image:", error);
    return "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop"; // Fallback image
  }
};

// Cache for loaded movies with images
let moviesWithImages: Movie[] = [...moviesCollection];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  // Since we're using backup URLs, this function is simpler now
  // We just need to ensure all movies have an imageUrl
  const updatedMovies = await Promise.all(
    moviesCollection.map(async (movie) => {
      // Only fetch if the movie doesn't already have an imageUrl
      if (!movie.imageUrl) {
        const imageUrl = await fetchMovieImages(movie);
        return { ...movie, imageUrl };
      }
      return movie;
    })
  );
  
  moviesWithImages = updatedMovies;
  imagesLoaded = true;
};

// Getter function for the cached movies
export const getLoadedMovies = (): Movie[] => {
  return moviesWithImages;
};
