/* eslint-disable */
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useGoalStore, Goal } from '@/store/goalStore';
import { useNotificationStore } from '@/store/notificationStore';

interface GoalFormProps {
  initialData?: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { addGoal, updateGoal } = useGoalStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.target_amount?.toString() || '');
  const [targetDate, setTargetDate] = useState(initialData?.target_date || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || isNaN(Number(targetAmount)) || !targetDate) {
      setError('Please fill in all required fields properly');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (initialData) {
        await updateGoal(initialData.id, {
          name,
          target_amount: Number(targetAmount),
          target_date: targetDate,
        });
        addNotification('Goal Updated', `${name} has been successfully updated.`, 'success');
      } else {
        await addGoal({
          name,
          target_amount: Number(targetAmount),
          target_date: targetDate,
        });
        addNotification('New Goal Created! 🎉', `Good luck saving for ${name}!`, 'success');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex h-11 w-full rounded-md border border-border/40 bg-surface/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="goalName" className="text-sm font-medium leading-none">Goal Name</label>
        <input
          id="goalName"
          name="goalName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. New Car, Emergency Fund"
          required
          autoComplete="off"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="targetAmount" className="text-sm font-medium leading-none">Target Amount</label>
        <input
          id="targetAmount"
          name="targetAmount"
          type="number"
          step="0.01"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0.00"
          required
          autoComplete="off"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Target Date</label>
        <DatePicker value={targetDate} onChange={setTargetDate} />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};

