import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null (not a throw) when unconfigured, so a missing env var only breaks
// the auth/dashboard routes that need it — not the whole app, which still
// has to serve the original config.js-driven demo at "/" either way.
if (!url || !anonKey) {
  console.warn(
    "Supabase not configured: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are " +
      "missing. Copy .env.example to .env.local and fill in your project's " +
      "values (or set them in the Vercel project's Environment Variables). " +
      "Auth/dashboard routes are disabled until then."
  );
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
