/* eslint-disable */
"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';
import { useTransactionStore } from '../../store/transactionStore';
import type { TransactionType } from '../../store/transactionStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useLanguage } from '../providers/LanguageProvider';

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Health', label: 'Health' },
  { value: 'Others', label: 'Others' },
];

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onCancel }) => {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { t } = useLanguage();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addTransaction({
        type,
        amount: Number(amount),
        category,
        date,
        note,
      });

      if (type === 'expense' && Number(amount) >= 10000) {
        addNotification('Large Expense Logged', `You just logged an expense of ${Number(amount).toLocaleString()}. Keep an eye on your budget!`, 'warning');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex h-11 w-full rounded-md border border-border/40 bg-surface/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex rounded-lg border border-border/40 bg-surface/50 p-1">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            type === 'expense' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground hover:bg-border/40'
          }`}
        >
          {t('Expense')}
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            type === 'income' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground hover:bg-border/40'
          }`}
        >
          {t('Income')}
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('Amount')}</label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          autoComplete="off"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium leading-none">{t('Category')}</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className={inputClass}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t('Date')}</label>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="space-y-2">
        <label htmlFor="note" className="text-sm font-medium leading-none">{t('Note (Optional)')}</label>
        <input
          id="note"
          name="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
          autoComplete="off"
          className={inputClass}
        />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            {t('Cancel')}
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : t('Save Transaction')}
        </Button>
      </div>
    </form>
  );
};

