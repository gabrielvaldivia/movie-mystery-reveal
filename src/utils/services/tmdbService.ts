import { Movie } from '../types/movieTypes';

// The Movie Database API configuration
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

// Use a free API key for demo purposes
// In a production app, this should be stored securely
const TMDB_API_KEY = "2dca580c2a14b55200e784d157207b4d";

// Generate a better hint that doesn't reveal the title
const generateObscureHint = (overview: string, title: string): string => {
  if (!overview || overview.trim() === '') {
    return "A mysterious film awaits";
  }
  
  // Remove any direct mentions of the movie title from the overview
  const titleWords = title.toLowerCase().split(/\s+/);
  const titleYear = title.match(/\b(19|20)\d{2}\b/)?.[0]; // Extract year if present in title
  
  // Extract words from the overview
  const words = overview.split(/\s+/);
  
  // Common words to filter out (expanded list)
  const commonWords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'by', 'for', 'with', 'about',
    'from', 'to', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'but', 'or', 'as', 'if', 
    'then', 'else', 'when', 'up', 'down', 'out', 'over', 'under', 'again',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'can', 'will', 'just', 'should', 'now', 'film', 'movie', 'story', 'who',
    'after', 'before', 'into', 'through', 'during', 'himself', 'herself', 'their',
    'they', 'them', 'this', 'that', 'these', 'those'
  ]);
  
  // Filter out common words, short words, numbers, and words from the title
  const keywords = words.filter(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Skip empty words, common words, short words, numbers, or years
    if (cleanWord.length < 5 || 
        /^\d+$/.test(cleanWord) || 
        commonWords.has(cleanWord) ||
        (titleYear && cleanWord.includes(titleYear))) {
      return false;
    }
    
    // Skip words that are in the title or contain title words (for titles with multiple words)
    for (const titleWord of titleWords) {
      if (titleWord.length >= 4 && 
         (cleanWord.includes(titleWord) || titleWord.includes(cleanWord))) {
        return false;
      }
    }
    
    return true;
  });
  
  // Generate different types of hints
  
  // 1. Character or theme-based hint (if we have enough keywords)
  const uniqueKeywords = [...new Set(keywords)];
  if (uniqueKeywords.length >= 3) {
    // Select 2-3 random keywords
    const shuffled = [...uniqueKeywords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, Math.min(3, shuffled.length));
    
    const hintTypes = [
      `Features themes of: ${selectedWords.join(', ')}`,
      `Contains elements of: ${selectedWords.join(', ')}`,
      `Look for these themes: ${selectedWords.join(', ')}`,
      `Key elements include: ${selectedWords.join(', ')}`
    ];
    
    return hintTypes[Math.floor(Math.random() * hintTypes.length)];
  }
  
  // 2. Era or setting hint (try to determine time period)
  const decades = ['20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s', '2000s', '2010s', '2020s'];
  const decadeWords = ['vintage', 'classic', 'retro', 'modern', 'contemporary', 'futuristic'];
  const overviewLower = overview.toLowerCase();
  
  for (const decade of decades) {
    if (overviewLower.includes(decade) || 
        overviewLower.includes(`19${decade}`) || 
        overviewLower.includes(`20${decade}`)) {
      return `Set in or reminiscent of the ${decade}`;
    }
  }
  
  // 3. Genre-based hints
  const genres = {
    'action': ['action', 'explosion', 'fight', 'battle', 'combat', 'mission'],
    'comedy': ['comedy', 'funny', 'laugh', 'humor', 'hilarious', 'joke'],
    'drama': ['drama', 'emotional', 'relationship', 'struggle', 'conflict'],
    'horror': ['horror', 'scary', 'terrifying', 'fear', 'frightening', 'terror'],
    'sci-fi': ['space', 'future', 'alien', 'planet', 'technology', 'robot'],
    'fantasy': ['magic', 'fantasy', 'mythical', 'creature', 'kingdom'],
    'thriller': ['suspense', 'thriller', 'mystery', 'detective', 'crime'],
    'romance': ['love', 'romance', 'relationship', 'wedding', 'marriage'],
    'animation': ['animation', 'animated', 'cartoon', 'pixar', 'disney'],
    'adventure': ['adventure', 'journey', 'quest', 'expedition', 'explore']
  };
  
  for (const [genre, genreWords] of Object.entries(genres)) {
    for (const word of genreWords) {
      if (overviewLower.includes(word)) {
        return `A ${genre} film with unexpected twists`;
      }
    }
  }
  
  // 4. Fallback: Use decade from release year if available
  if (title.match(/\(\d{4}\)/) || title.match(/\b(19|20)\d{2}\b/)) {
    const yearMatch = title.match(/\((\d{4})\)/) || title.match(/\b((19|20)\d{2})\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1] || yearMatch[2]);
      const decade = Math.floor(year / 10) * 10;
      return `A film from the ${decade}s era`;
    }
  }
  
  // 5. Last resort random fallbacks
  const fallbacks = [
    "A cinematic journey worth experiencing",
    "A film that left audiences talking",
    "One of cinema's memorable stories",
    "A storyline that captivates viewers",
    "A movie that makes you think",
    "Known for its distinctive style"
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// Fetch popular movies from TMDB
export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    console.log(`Fetching popular American movies - page ${page}`);
    
    // Use region=US parameter to only get American movies
    // Also add 'with_original_language=en' to further filter for English language films
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&region=US&with_original_language=en`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received ${data.results.length} movies from page ${page}`);
    
    // Additional filter to make sure we're only getting US movies (some might slip through)
    const usMovies = data.results.filter((movie: any) => {
      return movie.original_language === 'en' && 
             (!movie.origin_country || movie.origin_country.includes('US'));
    });
    
    console.log(`Filtered to ${usMovies.length} American movies from page ${page}`);
    
    // Map TMDB movie format to our app's Movie format
    return usMovies.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: new Date(movie.release_date).getFullYear() || 0,
      hint: generateObscureHint(movie.overview, movie.title), // Generate obscure hint
      tmdbId: movie.id,
      poster_path: movie.poster_path
    }));
  } catch (error) {
    console.error(`Error fetching popular movies (page ${page}):`, error);
    // Return empty array instead of throwing to handle individual page failures gracefully
    return [];
  }
};

// Search movies by title
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    // Add region=US parameter to only get American movies
    const response = await fetch(
      `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&region=US&with_original_language=en`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Additional filter for American movies
    const usMovies = data.results.filter((movie: any) => 
      movie.original_language === 'en' && 
      (!movie.origin_country || movie.origin_country.includes('US'))
    );
    
    return usMovies.map((movie: any) => ({
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      hint: generateObscureHint(movie.overview, movie.title), // Generate obscure hint
      tmdbId: movie.id,
      poster_path: movie.poster_path
    }));
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId: string): Promise<Movie> => {
  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const movie = await response.json();
    
    return {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
      hint: generateObscureHint(movie.overview, movie.title), // Generate obscure hint
      tmdbId: movie.id,
      poster_path: movie.poster_path
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};
