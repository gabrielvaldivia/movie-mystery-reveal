
// Movie data with simpler, more reliable image URLs

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
}

// Simple movie collection with movie posters from Wikimedia or other reliable sources
export const moviesCollection: Movie[] = [
  {
    id: "1",
    title: "Inception",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    releaseYear: 2010,
    hint: "Dreams within dreams"
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    releaseYear: 1994,
    hint: "Prison escape drama"
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
    releaseYear: 1994,
    hint: "Non-linear storytelling"
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
    releaseYear: 1999,
    hint: "Reality is not what it seems"
  },
  {
    id: "5",
    title: "The Godfather",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
    releaseYear: 1972,
    hint: "An offer you can't refuse"
  },
  {
    id: "6",
    title: "The Dark Knight",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    releaseYear: 2008,
    hint: "Why so serious?"
  },
  {
    id: "7",
    title: "Schindler's List",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg",
    releaseYear: 1993,
    hint: "The man who saved lives during the Holocaust"
  },
  {
    id: "8",
    title: "The Lord of the Rings: The Return of the King",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/be/The_Lord_of_the_Rings_-_The_Return_of_the_King_%282003%29.jpg",
    releaseYear: 2003,
    hint: "The final chapter of a fantasy trilogy"
  },
  {
    id: "9",
    title: "Fight Club",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg",
    releaseYear: 1999,
    hint: "First rule: don't talk about it"
  },
  {
    id: "10",
    title: "Forrest Gump",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
    releaseYear: 1994,
    hint: "Life is like a box of chocolates"
  },
  {
    id: "11",
    title: "Star Wars: Episode V - The Empire Strikes Back",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg",
    releaseYear: 1980,
    hint: "I am your father"
  },
  {
    id: "12",
    title: "The Shining",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/ea/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg",
    releaseYear: 1980,
    hint: "Here's Johnny!"
  },
  {
    id: "13",
    title: "Jurassic Park",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg",
    releaseYear: 1993,
    hint: "Life finds a way"
  },
  {
    id: "14",
    title: "Titanic",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png",
    releaseYear: 1997,
    hint: "I'll never let go"
  },
  {
    id: "15",
    title: "Toy Story",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg",
    releaseYear: S1995,
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
