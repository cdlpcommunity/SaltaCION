import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export interface ScoreEntry {
  id: string;
  player_name: string;
  score: number;
  coins: number;
  height: number;
  user_id: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  username: string;
}

export function usernameToFakeEmail(username: string): string {
  return `${username.toLowerCase()}@saltacion.game`;
}

export function extractUsername(email: string): string {
  return email.replace(/@saltacion\.game$/i, '');
}
