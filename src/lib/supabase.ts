import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Quick check for whether Supabase is configured. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Returns an anonymous (no-auth) Supabase client for data queries.
 * Returns null when env vars are missing (mock-data fallback mode).
 */
export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
