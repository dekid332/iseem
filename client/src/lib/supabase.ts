import { createClient } from '@supabase/supabase-js'

// Types for our leaderboard
export interface LeaderboardEntry {
  id: number;
  username: string;
  wallet_address?: string;
  score: number;
  level: number;
  enemies_killed: number;
  game_time: number;
  created_at: string;
}

export interface InsertLeaderboardEntry {
  username: string;
  wallet_address?: string;
  score: number;
  level: number;
  enemies_killed: number;
  game_time: number;
}

// Supabase client - will be null if no URL/key provided
let supabase: ReturnType<typeof createClient> | null = null;

// Initialize Supabase if environment variables are available
export function initializeSupabase() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase initialized successfully');
    return true;
  }
  
  console.log('Supabase not initialized - missing environment variables');
  return false;
}

// Check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

// Get leaderboard entries from Supabase
export async function getSupabaseLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) {
    throw new Error('Supabase not initialized');
  }

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }

  return data || [];
}

// Submit score to Supabase
export async function submitSupabaseScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
  if (!supabase) {
    throw new Error('Supabase not initialized');
  }

  const { data, error } = await supabase
    .from('leaderboard')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('Error submitting score:', error);
    throw error;
  }

  return data;
}

// Initialize on module load
initializeSupabase();