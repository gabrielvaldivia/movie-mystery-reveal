import { supabase, LeaderboardEntry, Difficulty } from '../lib/supabase';

class LeaderboardService {
  async getTopScores(difficulty: Difficulty): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }

    // Log the raw data to see what we're getting from the database
    console.log('Raw leaderboard data:', data);

    // Transform the data to ensure consistent property names
    const transformedData = (data || []).map(entry => ({
      id: entry.id,
      created_at: entry.created_at,
      player_name: entry.player_name || entry.playerName || entry.name || 'Anonymous',
      score: entry.score,
      difficulty: entry.difficulty
    }));

    console.log('Transformed leaderboard data:', transformedData);
    return transformedData;
  }

  async saveScore(playerName: string, score: number, difficulty: Difficulty): Promise<void> {
    const { error } = await supabase
      .from('leaderboard')
      .insert([
        {
          player_name: playerName,
          score,
          difficulty
        }
      ]);

    if (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService(); 