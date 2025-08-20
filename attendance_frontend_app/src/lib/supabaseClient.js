import { createClient } from "@supabase/supabase-js";
import { APP_CONFIG } from "../config";

/**
 * Initializes and exports a singleton Supabase client.
 * PUBLIC_INTERFACE
 */
let supabaseInstance = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Get a singleton Supabase client instance configured from env. */
  if (!supabaseInstance) {
    if (!APP_CONFIG.SUPABASE_URL || !APP_CONFIG.SUPABASE_ANON_KEY) {
      // Provide a clear error for missing env configuration
      // The orchestrator should set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
      // to allow the app to authenticate.
      // We avoid throwing in production builds to not crash UI; instead we log an error.
      // Auth pages will show a message if client is unavailable.
      // eslint-disable-next-line no-console
      console.error("Supabase env vars are missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.");
    }
    supabaseInstance = createClient(APP_CONFIG.SUPABASE_URL || "", APP_CONFIG.SUPABASE_ANON_KEY || "", {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

// PUBLIC_INTERFACE
export async function signInWithEmail(email, password) {
  /** Sign in using email/password via Supabase. */
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

// PUBLIC_INTERFACE
export async function signUpWithEmail(email, password) {
  /** Sign up using email/password via Supabase. Uses SITE_URL for email redirect. */
  const supabase = getSupabaseClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: APP_CONFIG.SITE_URL,
    },
  });
}

// PUBLIC_INTERFACE
export async function signOut() {
  /** Sign out the current user. */
  const supabase = getSupabaseClient();
  return supabase.auth.signOut();
}

// PUBLIC_INTERFACE
export async function getCurrentUser() {
  /** Returns the current authenticated user or null. */
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}
