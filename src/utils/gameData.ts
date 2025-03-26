
// Re-export everything from the new modular files for backward compatibility

// Export types
export { Movie } from './types/movieTypes';

// Export movie collection
export { moviesCollection, TMDB_IMAGE_BASE_URL } from './data/movieCollection';

// Export image services
export { 
  fetchMovieImages,
  loadAllMovieImages
} from './services/movieImageService';

// Export game mechanics
export {
  getRandomMovie,
  getNextMovie
} from './services/gameService';
