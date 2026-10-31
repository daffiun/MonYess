import { supabase } from '@/lib/supabase';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, Session, AuthChangeEvent } from '@supabase/supabase-js';

export const authService = {
  async getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async signInWithPassword(credentials: SignInWithPasswordCredentials) {
    return supabase.auth.signInWithPassword(credentials);
  },

  async signUp(credentials: SignUpWithPasswordCredentials) {
    return supabase.auth.signUp(credentials);
  },

  async signOut() {
    return supabase.auth.signOut();
  },
};
