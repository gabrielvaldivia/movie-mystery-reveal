
// Movie data with TMDB API integration

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
  tmdbId?: number; // Added TMDB ID for fetching images
}

// TMDB API configuration
// Note: Even though this is marked as a public API key, it seems to be invalid or revoked
// Using a different approach with predefined image URLs for reliability
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"; // Medium size images

// Sample movies with backup image URLs
export const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w780/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg", // Backup image URL
    releaseYear: 2010,
    hint: "Dreams within dreams",
    tmdbId: 27205
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: "https://image.tmdb.org/t/p/w780/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg", // Backup image URL
    releaseYear: 1994,
    hint: "Prison escape drama",
    tmdbId: 278
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", // Backup image URL
    releaseYear: 1994,
    hint: "Non-linear storytelling",
    tmdbId: 680
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", // Backup image URL
    releaseYear: 1999,
    hint: "Reality is not what it seems",
    tmdbId: 603
  },
  {
    id: "5",
    title: "Forrest Gump",
    imageUrl: "https://image.tmdb.org/t/p/w780/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", // Backup image URL
    releaseYear: 1994,
    hint: "Life is like a box of chocolates",
    tmdbId: 13
  }
];

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

// Prefetch and cache all movie images
let moviesWithImages: Movie[] = [...sampleMovies];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  // Since we're using backup URLs, this function is simpler now
  // We just need to ensure all movies have an imageUrl
  const updatedMovies = await Promise.all(
    sampleMovies.map(async (movie) => {
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

export const getRandomMovie = async (): Promise<Movie> => {
  if (!imagesLoaded) {
    await loadAllMovieImages();
  }
  
  const randomIndex = Math.floor(Math.random() * moviesWithImages.length);
  return moviesWithImages[randomIndex];
};

export const getNextMovie = async (currentId: string): Promise<Movie> => {
  if (!imagesLoaded) {
    await loadAllMovieImages();
  }
  
  const currentIndex = moviesWithImages.findIndex(movie => movie.id === currentId);
  const nextIndex = (currentIndex + 1) % moviesWithImages.length;
  return moviesWithImages[nextIndex];
};
