/* eslint-disable */
import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { useAuthStore } from './authStore';
import { useTransactionStore } from './transactionStore';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  image_url?: string;
  created_at?: string;
}

interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'current_amount'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  addFunds: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  fetchGoals: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ goals: data as Goal[] });
    } catch (err: any) {
      console.error('Error fetching goals:', err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addGoal: async (newGoal) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{ ...newGoal, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ goals: [data as Goal, ...state.goals] }));
    } catch (err: any) {
      console.error('Error adding goal:', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateGoal: async (id: string, updates: Partial<Goal>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? (data as Goal) : g)),
      }));
    } catch (err: any) {
      console.error('Error updating goal:', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  addFunds: async (id: string, amount: number) => {
    const state = get();
    const goal = state.goals.find((g) => g.id === id);
    if (!goal) return;

    set({ loading: true, error: null });
    try {
      const newAmount = goal.current_amount + amount;

      // Update goal in Supabase
      const { error: goalError } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', id);

      if (goalError) throw goalError;

      // Create an expense transaction for adding funds
      const addTransaction = useTransactionStore.getState().addTransaction;
      await addTransaction({
        type: 'expense',
        amount: amount,
        category: 'Savings',
        date: new Date().toISOString().split('T')[0],
        note: `Funded goal: ${goal.name}`,
      });

      // Update local state
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, current_amount: newAmount } : g
        ),
      }));

      // Trigger email if goal just reached its target
      if (goal.current_amount < goal.target_amount && newAmount >= goal.target_amount) {
        const user = useAuthStore.getState().user;
        if (user && user.email) {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              subject: `🎉 Goal Achieved: ${goal.name}`,
              message: `Congratulations! You have successfully reached your target of ${goal.target_amount.toLocaleString()} for your goal: <strong>${goal.name}</strong>. Keep up the great work saving with Pundo!`
            })
          }).catch(console.error); // Fire and forget
        }
      }
    } catch (err: any) {
      console.error('Error adding funds to goal:', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteGoal: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      }));
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

