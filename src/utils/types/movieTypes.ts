
// Movie data types

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
  tmdbId?: number;
}
