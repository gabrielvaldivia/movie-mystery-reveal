
import { Movie } from '../types/movies';
import { allMovies } from '../data/movieData';
import { loadAllMovieImages } from '../loaders/imageLoader';

// Filter out movies with TMDB image URLs that consistently fail
const getFilteredMovies = () => {
  return allMovies;
};

// Get a random movie from the collection
export const getRandomMovie = async (): Promise<Movie> => {
  // Ensure we have movies to select from
  const filteredMovies = getFilteredMovies();
  if (filteredMovies.length === 0) {
    throw new Error("No movies available");
  }

  // Get a random movie
  const randomIndex = Math.floor(Math.random() * filteredMovies.length);
  const movie = filteredMovies[randomIndex];

  return movie;
};

// Get next movie, ensuring it's different from the current one
export const getNextMovie = async (currentMovieId: string): Promise<Movie> => {
  // Filter out the current movie
  const filteredMovies = getFilteredMovies();
  const availableMovies = filteredMovies.filter(movie => movie.id !== currentMovieId);

  if (availableMovies.length === 0) {
    throw new Error("No more movies available");
  }

  // Get a random movie from the filtered list
  const randomIndex = Math.floor(Math.random() * availableMovies.length);
  return availableMovies[randomIndex];
};

// Load all movie images
export const preloadAllMovieImages = async (): Promise<void> => {
  const imageUrls = allMovies.map(movie => movie.imageUrl);
  await loadAllMovieImages(imageUrls);
};
