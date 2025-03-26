
import { Movie } from '../types/movieTypes';
import { loadAllMovieImages, getLoadedMovies } from './movieImageService';

export const getRandomMovie = async (): Promise<Movie> => {
  await loadAllMovieImages();
  
  const moviesWithImages = getLoadedMovies();
  const randomIndex = Math.floor(Math.random() * moviesWithImages.length);
  return moviesWithImages[randomIndex];
};

export const getNextMovie = async (currentId: string): Promise<Movie> => {
  await loadAllMovieImages();
  
  const moviesWithImages = getLoadedMovies();
  
  // Get a completely random movie that's different from the current one
  let randomIndex;
  let nextMovie;
  
  do {
    randomIndex = Math.floor(Math.random() * moviesWithImages.length);
    nextMovie = moviesWithImages[randomIndex];
  } while (nextMovie.id === currentId && moviesWithImages.length > 1);
  
  return nextMovie;
};
