import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { useAuthStore } from './authStore';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (title: string, message: string, type?: Notification['type']) => Promise<void>;
  initializeRealtime: () => (() => void) | void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const unreadCount = data.filter(n => !n.is_read).length;
      set({ notifications: data as Notification[], unreadCount, loading: false });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { notifications } = get();
    // Optimistic update
    set({
      notifications: notifications.map(n => n.id === id ? { ...n, is_read: true } : n),
      unreadCount: Math.max(0, get().unreadCount - 1)
    });

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert on error if needed
    }
  },

  markAllAsRead: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const { notifications } = get();

    // Optimistic update
    set({
      notifications: notifications.map(n => ({ ...n, is_read: true })),
      unreadCount: 0
    });

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  addNotification: async (title, message, type = 'info') => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    // Create a temporary ID for optimistic update
    const tempId = crypto.randomUUID();
    const newNotif: Notification = {
      id: tempId,
      user_id: user.id,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString()
    };

    // Optimistically update the store immediately so it pops up without waiting for the DB
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ user_id: user.id, title, message, type }])
        .select()
        .single();
        
      if (error) throw error;

      // Replace the temporary optimistic notification with the real one from the DB
      set((state) => ({
        notifications: state.notifications.map(n => n.id === tempId ? data as Notification : n)
      }));
    } catch (error) {
      console.error('Error adding notification:', error);
      // Revert optimistic update on error
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== tempId),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    }
  },

  initializeRealtime: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const channel = supabase
      .channel('custom-notification-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotification = payload.new as Notification;
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));
