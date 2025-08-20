//
// PUBLIC_INTERFACE
export const APP_CONFIG = {
  /** Frontend configuration for API and Supabase. */
  // IMPORTANT: These should be provided via environment variables in a .env file.
  // Do not hardcode secrets in code. The orchestrator will inject them.
  // For CRA (react-scripts), variables must start with REACT_APP_
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
  SITE_URL: process.env.REACT_APP_SITE_URL || "http://localhost:3000",
};
