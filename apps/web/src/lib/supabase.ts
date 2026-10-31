import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Missing Supabase environment variables. Using placeholder client. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/web/.env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
