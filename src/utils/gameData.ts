
// Main gameData file that re-exports all necessary components

// Export types
export { type Movie } from './types/movies';

// Export movie data and selection functions
export { allMovies as moviesCollection } from './data/movieData';
export { 
  getRandomMovie, 
  getNextMovie,
  preloadAllMovieImages as loadAllMovieImages
} from './game/movieSelector';
