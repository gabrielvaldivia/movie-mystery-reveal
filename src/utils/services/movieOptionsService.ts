import { Movie } from '../types/movieTypes';
import { getMoviesCollection } from '../data/movieCollection';

let allMovies: Movie[] = [];

// Initialize the movie collection
export const initializeMovieOptions = async () => {
  if (allMovies.length === 0) {
    allMovies = await getMoviesCollection();
  }
};

// Get random movie titles excluding the correct answer
export const getRandomMovieTitles = (correctMovie: Movie, count: number = 3): string[] => {
  // Filter out the correct movie and get random movies
  const otherMovies = allMovies
    .filter(movie => movie.title !== correctMovie.title)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  // Combine with correct answer and shuffle
  const options = [...otherMovies.map(m => m.title), correctMovie.title];
  return options.sort(() => Math.random() - 0.5);
};

// Reset the movie collection (useful for testing or restarting)
export const resetMovieOptions = () => {
  allMovies = [];
}; 