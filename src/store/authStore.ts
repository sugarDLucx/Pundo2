import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  loginHistory: any[];
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  fetchLoginHistory: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  error: null,
  loginHistory: [],
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
    
    if (data.user && fullName) {
      try {
        const { error: updateError } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', data.user.id);
        if (updateError) {
          await supabase.from('profiles').insert({ id: data.user.id, full_name: fullName });
        }
      } catch (e) {
        console.warn("Failed to set full name during signup");
      }
    }
    
    set({ loading: false });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Log history
      if (data.session?.user) {
        try {
          // Attempt to log IP and user agent (basic info, IP might need a proxy edge function, but we'll store basic agent for now)
          await supabase.from('login_history').insert([{
            user_id: data.session.user.id,
            user_agent: navigator.userAgent
          }]);
        } catch (e) {
          console.warn("Failed to log login history (table might not exist yet)");
        }
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      set({ session, user: session?.user || null, initialized: true, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user || null });
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      set({ initialized: true, loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ session: null, user: null, loading: false });
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Could not verify user email.");

      // Verify old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword
      });
      if (signInError) throw new Error("Current password is incorrect.");

      // Change password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchLoginHistory: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (!error && data) {
        set({ loginHistory: data });
      }
    } catch (e) {
      console.warn("Failed to fetch login history");
    }
  }
}));
