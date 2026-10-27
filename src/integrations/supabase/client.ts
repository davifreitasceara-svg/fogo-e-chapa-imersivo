import { createClient } from "@supabase/supabase-js";

const env = import.meta.env;

const supabaseUrl =
  (env?.["VITE_SUPABASE_URL"] as string | undefined) ||
  "https://hytbvsamaleaznnzzwqj.supabase.co";

const supabaseKey =
  (env?.["VITE_SUPABASE_ANON_KEY"] as string | undefined) ||
  (env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ||
  "sb_publishable_y3zRUvHGxtShZl9Ab5Y_XA_S2bJP5jd";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
