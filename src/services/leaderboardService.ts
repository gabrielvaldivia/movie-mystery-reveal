import { supabase, LeaderboardEntry } from '../lib/supabase';

export const leaderboardService = {
  async saveScore(name: string, score: number): Promise<void> {
    const { error } = await supabase
      .from('leaderboard')
      .insert([{ name, score }]);

    if (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  },

  async getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }

    return data || [];
  }
}; 