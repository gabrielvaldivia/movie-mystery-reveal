
// Types for movie data
export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
  tmdbId?: number;
}
