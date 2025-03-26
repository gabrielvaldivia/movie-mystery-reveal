// Movie data using TMDB API

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
}

// API configuration for TMDB
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

// Movie collection using TMDB image paths
export const moviesCollection: Movie[] = [
  {
    id: "1",
    title: "Inception",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg`,
    releaseYear: 2010,
    hint: "Dreams within dreams"
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg`,
    releaseYear: 1994,
    hint: "Prison escape drama"
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg`,
    releaseYear: 1994,
    hint: "Non-linear storytelling"
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg`,
    releaseYear: 1999,
    hint: "Reality is not what it seems"
  },
  {
    id: "5",
    title: "The Godfather",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/3bhkrj58Vtu7enYsRolD1fZdja1.jpg`,
    releaseYear: 1972,
    hint: "An offer you can't refuse"
  },
  {
    id: "6",
    title: "The Dark Knight",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    releaseYear: 2008,
    hint: "Why so serious?"
  },
  {
    id: "7",
    title: "Schindler's List",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg`,
    releaseYear: 1993,
    hint: "The man who saved lives during the Holocaust"
  },
  {
    id: "8",
    title: "The Lord of the Rings: The Return of the King",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg`,
    releaseYear: 2003,
    hint: "The final chapter of a fantasy trilogy"
  },
  {
    id: "9",
    title: "Fight Club",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg`,
    releaseYear: 1999,
    hint: "First rule: don't talk about it"
  },
  {
    id: "10",
    title: "Forrest Gump",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg`,
    releaseYear: 1994,
    hint: "Life is like a box of chocolates"
  },
  {
    id: "11",
    title: "Star Wars: Episode V - The Empire Strikes Back",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg`,
    releaseYear: 1980,
    hint: "I am your father"
  },
  {
    id: "12",
    title: "The Shining",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg`,
    releaseYear: 1980,
    hint: "Here's Johnny!"
  },
  {
    id: "13",
    title: "Jurassic Park",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg`,
    releaseYear: 1993,
    hint: "Life finds a way"
  },
  {
    id: "14",
    title: "Titanic",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg`,
    releaseYear: 1997,
    hint: "I'll never let go"
  },
  {
    id: "15",
    title: "Toy Story",
    imageUrl: `${TMDB_IMAGE_BASE_URL}/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg`,
    releaseYear: 1995,
    hint: "To infinity and beyond!"
  }
];

// Helper function to preload movie images with improved error handling
export const loadAllMovieImages = async (): Promise<void> => {
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
      console.log(`Starting to preload: ${url}`);
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        console.log(`Successfully preloaded: ${url}`);
        resolve();
      };
      
      img.onerror = (e) => {
        console.error(`Failed to preload image: ${url}`, e);
        resolve(); // Still resolve to prevent hanging the promise chain
      };
      
      img.src = url;
    });
  };

  try {
    console.log("Starting image preloading...");
    
    // Load all images at once since we have a smaller collection now
    const imagePromises = moviesCollection.map(movie => preloadImage(movie.imageUrl));
    
    // Wait for all images to preload
    await Promise.all(imagePromises);
    console.log("All images preloaded");
  } catch (error) {
    console.error("Error in loadAllMovieImages:", error);
  }
};

// Get a random movie from the collection
export const getRandomMovie = async (): Promise<Movie> => {
  console.log("Getting random movie...");
  
  // Ensure we have movies to select from
  if (moviesCollection.length === 0) {
    throw new Error("No movies available");
  }

  // Get a random movie
  const randomIndex = Math.floor(Math.random() * moviesCollection.length);
  const movie = moviesCollection[randomIndex];
  
  console.log(`Selected movie: ${movie.title}`);
  return movie;
};

// Get next movie, ensuring it's different from the current one
export const getNextMovie = async (currentMovieId: string): Promise<Movie> => {
  console.log(`Getting next movie after movie ID: ${currentMovieId}`);
  
  // Filter out the current movie
  const availableMovies = moviesCollection.filter(movie => movie.id !== currentMovieId);

  if (availableMovies.length === 0) {
    throw new Error("No more movies available");
  }

  // Get a random movie from the filtered list
  const randomIndex = Math.floor(Math.random() * availableMovies.length);
  const nextMovie = availableMovies[randomIndex];
  
  console.log(`Selected next movie: ${nextMovie.title}`);
  return nextMovie;
};
