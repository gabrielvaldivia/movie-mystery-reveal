
import { Movie } from '../types/movieTypes';
import { moviesCollectionPart1 } from './movieCollectionPart1';
import { moviesCollectionPart2 } from './movieCollectionPart2';
import { moviesCollectionPart3 } from './movieCollectionPart3';

// TMDB API configuration
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"; // Medium size images

// Combine all movie parts into the main collection
export const moviesCollection: Movie[] = [
  ...moviesCollectionPart1,
  ...moviesCollectionPart2,
  ...moviesCollectionPart3
];
