// Movie data types

// TMDb API response types
export interface TMDbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  original_language: string;
  origin_country?: string[];
  vote_count: number;
  vote_average: number;
}

export interface TMDbResponse {
  page: number;
  results: TMDbMovie[];
  total_results: number;
  total_pages: number;
}

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  releaseYear: number;
  hint?: string;
  tmdbId?: number;
  poster_path?: string;
  vote_average?: number;
  vote_count?: number;
}
