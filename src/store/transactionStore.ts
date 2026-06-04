import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { useAuthStore } from './authStore';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  created_at?: string;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ transactions: data as Transaction[] });
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (newTx) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...newTx, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Update local state by prepending the new transaction
      set((state) => ({
        transactions: [data as Transaction, ...state.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));
    } catch (err: any) {
      console.error('Error adding transaction:', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteTransaction: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      }));
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
