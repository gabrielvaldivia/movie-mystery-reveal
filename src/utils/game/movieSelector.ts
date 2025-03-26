
import { Movie } from '../types/movies';
import { allMovies } from '../data/movieData';
import { loadAllMovieImages } from '../loaders/imageLoader';

// Get a random movie from the collection
export const getRandomMovie = async (): Promise<Movie> => {
  // Ensure we have movies to select from
  const filteredMovies = allMovies;
  if (filteredMovies.length === 0) {
    throw new Error("No movies available");
  }

  // Get a random movie
  const randomIndex = Math.floor(Math.random() * filteredMovies.length);
  const movie = filteredMovies[randomIndex];
  
  // If the movie has a TMDB image URL, replace it with a static placeholder
  if (movie.imageUrl.includes('image.tmdb.org')) {
    return {
      ...movie,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
    };
  }

  return movie;
};

// Get next movie, ensuring it's different from the current one
export const getNextMovie = async (currentMovieId: string): Promise<Movie> => {
  // Filter out the current movie
  const filteredMovies = allMovies;
  const availableMovies = filteredMovies.filter(movie => movie.id !== currentMovieId);

  if (availableMovies.length === 0) {
    throw new Error("No more movies available");
  }

  // Get a random movie from the filtered list
  const randomIndex = Math.floor(Math.random() * availableMovies.length);
  const movie = availableMovies[randomIndex];
  
  // If the movie has a TMDB image URL, replace it with a static placeholder
  if (movie.imageUrl.includes('image.tmdb.org')) {
    return {
      ...movie,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
    };
  }
  
  return movie;
};

// Load all movie images
export const preloadAllMovieImages = async (): Promise<void> => {
  const imageUrls = allMovies.map(movie => 
    movie.imageUrl.includes('image.tmdb.org') 
      ? "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
      : movie.imageUrl
  );
  await loadAllMovieImages(imageUrls);
};
