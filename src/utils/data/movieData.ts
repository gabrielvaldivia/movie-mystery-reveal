
import { Movie } from '../types/movies';
import { moviesCollection } from './movieCollection';
import { moviesCollectionPart2 } from './movieCollectionPart2';
import { moviesCollectionPart3 } from './movieCollectionPart3';

// Combine all movie collections
export const allMovies: Movie[] = [
  ...moviesCollection,
  ...moviesCollectionPart2,
  ...moviesCollectionPart3
];
