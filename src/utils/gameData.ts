
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
const TMDB_API_KEY = "3e1dd17d199afbfd733a53927dfafc93"; // This is a public API key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"; // Medium size images

// Sample movies with TMDB IDs
export const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    imageUrl: "", // Will be populated from TMDB
    releaseYear: 2010,
    hint: "Dreams within dreams",
    tmdbId: 27205
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: "", // Will be populated from TMDB
    releaseYear: 1994,
    hint: "Prison escape drama",
    tmdbId: 278
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: "", // Will be populated from TMDB
    releaseYear: 1994,
    hint: "Non-linear storytelling",
    tmdbId: 680
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "", // Will be populated from TMDB
    releaseYear: 1999,
    hint: "Reality is not what it seems",
    tmdbId: 603
  },
  {
    id: "5",
    title: "Forrest Gump",
    imageUrl: "", // Will be populated from TMDB
    releaseYear: 1994,
    hint: "Life is like a box of chocolates",
    tmdbId: 13
  }
];

// Function to fetch movie images from TMDB
export const fetchMovieImages = async (movie: Movie): Promise<string> => {
  try {
    if (!movie.tmdbId) {
      console.error("No TMDB ID provided for movie:", movie.title);
      return "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop"; // Fallback image
    }

    // First try to get backdrops (usually more recognizable for the game)
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movie.tmdbId}/images?api_key=${TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Prefer backdrops, but fall back to posters if no backdrops available
    if (data.backdrops && data.backdrops.length > 0) {
      // Get a random backdrop from available ones
      const randomIndex = Math.floor(Math.random() * Math.min(data.backdrops.length, 5));
      return `${TMDB_IMAGE_BASE_URL}${data.backdrops[randomIndex].file_path}`;
    } else if (data.posters && data.posters.length > 0) {
      // Fall back to poster if no backdrops
      return `${TMDB_IMAGE_BASE_URL}${data.posters[0].file_path}`;
    }
    
    // If no images found, use fallback
    return "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop";
  } catch (error) {
    console.error("Error fetching movie images:", error);
    return "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop"; // Fallback image
  }
};

// Prefetch and cache all movie images
let moviesWithImages: Movie[] = [...sampleMovies];
let imagesLoaded = false;

export const loadAllMovieImages = async (): Promise<void> => {
  if (imagesLoaded) return;
  
  const updatedMovies = await Promise.all(
    sampleMovies.map(async (movie) => {
      const imageUrl = await fetchMovieImages(movie);
      return { ...movie, imageUrl };
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
