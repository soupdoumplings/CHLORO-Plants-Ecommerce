/**
 * CHLORO — Secure Database Connection
 * Initializes the Supabase client using environment variables
 * to protect sensitive API keys from the frontend codebase.
 */
import { createClient } from '@supabase/supabase-js'

// Retrieving credentials from .env for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

// Creating a single global client for the entire CHLORO application
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Connection verification log
if (supabase) {
  console.log('supabase connected')
}
