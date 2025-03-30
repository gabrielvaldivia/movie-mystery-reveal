import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Difficulty = 'easy' | 'hard';

export interface LeaderboardEntry {
  id: number;
  created_at: string;
  player_name: string;
  score: number;
  difficulty: Difficulty;
}

export type { GameMode } from '../components/GameContainer'; 