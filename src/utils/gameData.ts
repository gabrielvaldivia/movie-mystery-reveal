
// Temporary movie data until we connect to a real API

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
}

export const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1079&auto=format&fit=crop",
    releaseYear: 2010,
    hint: "Dreams within dreams"
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    imageUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1000&auto=format&fit=crop",
    releaseYear: 1994,
    hint: "Prison escape drama"
  },
  {
    id: "3",
    title: "Pulp Fiction",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1470&auto=format&fit=crop",
    releaseYear: 1994,
    hint: "Non-linear storytelling"
  },
  {
    id: "4",
    title: "The Matrix",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop",
    releaseYear: 1999,
    hint: "Reality is not what it seems"
  },
  {
    id: "5",
    title: "Forrest Gump",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop",
    releaseYear: 1994,
    hint: "Life is like a box of chocolates"
  }
];

export const getRandomMovie = (): Movie => {
  const randomIndex = Math.floor(Math.random() * sampleMovies.length);
  return sampleMovies[randomIndex];
};

export const getNextMovie = (currentId: string): Movie => {
  const currentIndex = sampleMovies.findIndex(movie => movie.id === currentId);
  const nextIndex = (currentIndex + 1) % sampleMovies.length;
  return sampleMovies[nextIndex];
};
