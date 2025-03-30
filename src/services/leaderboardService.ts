import { supabase, LeaderboardEntry } from '../lib/supabase';

export const leaderboardService = {
  async saveScore(name: string, score: number): Promise<void> {
    console.log('Attempting to save score:', { name, score });
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{ name, score }])
      .select();

    if (error) {
      console.error('Error saving score:', error);
      throw error;
    }
    console.log('Score saved successfully:', data);
  },

  async getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
    console.log('Fetching top scores...');
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
    console.log('Top scores fetched:', data);
    return data || [];
  }
}; 