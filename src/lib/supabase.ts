import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

if (import.meta.env.VITE_DEMO_MODE !== 'true' && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'sabiencia',
    },
  },
});

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export default supabase;