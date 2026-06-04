import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  language: string;
  currency: string;
  email_notifications: boolean;
  avatar_url?: string | null;
  dashboard_layout?: any[];
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        set({ profile: data });
      } else {
        // Create default profile if missing
        const newProfile = {
          id: session.user.id,
          language: 'English (United States)',
          currency: '₱',
          email_notifications: true
        };
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
          
        if (insertError) throw insertError;
        set({ profile: inserted });
      }
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching profile:', error.message);
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No profile loaded');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      set({ profile: { ...profile, ...updates } });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating profile:', error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  uploadAvatar: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const { profile } = get();
      if (!profile) throw new Error('No profile loaded');

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await get().updateProfile({ avatar_url: data.publicUrl });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error uploading avatar:', error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
