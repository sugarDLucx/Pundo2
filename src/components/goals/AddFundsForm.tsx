/* eslint-disable */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGoalStore } from '@/store/goalStore';
import { useNotificationStore } from '@/store/notificationStore';

interface AddFundsFormProps {
  goalId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddFundsForm: React.FC<AddFundsFormProps> = ({ goalId, onSuccess, onCancel }) => {
  const addFunds = useGoalStore((state) => state.addFunds);
  const goals = useGoalStore((state) => state.goals);
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const goal = goals.find(g => g.id === goalId);
      const currentSaved = goal?.current_amount || 0;
      const target = goal?.target_amount || 1;
      const previousPercentage = currentSaved / target;
      const newPercentage = (currentSaved + Number(amount)) / target;

      await addFunds(goalId, Number(amount));

      if (newPercentage >= 1 && previousPercentage < 1) {
        addNotification('Goal Reached! ðŸŽŠ', `You've fully funded your ${goal?.name} goal!`, 'success');
      } else if (newPercentage >= 0.5 && previousPercentage < 0.5) {
        addNotification('Halfway There! ðŸŽ¯', `You're 50% of the way to your ${goal?.name} goal!`, 'info');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex h-11 w-full rounded-md border border-border/40 bg-surface/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Amount to Add</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          className={inputClass}
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        This will automatically create a "Savings" expense in your transactions list.
      </p>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Funds'}
        </Button>
      </div>
    </form>
  );
};

