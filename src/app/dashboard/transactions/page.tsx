/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Wallet, TrendingUp, TrendingDown, Tag, Trash2, Receipt } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

export default function TransactionsPage() {
  const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactionStore();
  const { profile } = useProfileStore();
  const { t } = useLanguage();
  const currency = profile?.currency || '₱';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('This Month');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterType, setFilterType] = useState('All Types');

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  // --- Summary Calculations ---
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

  const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear);
  const lastMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonthDate.getMonth() && new Date(t.date).getFullYear() === lastMonthDate.getFullYear());

  const totalSpentThisMonth = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalSpentLastMonth = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  let spentPercentageChange = 0;
  if (totalSpentLastMonth > 0) {
    spentPercentageChange = ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100;
  } else if (totalSpentThisMonth > 0) {
    spentPercentageChange = 100;
  }
  const isSpentUp = spentPercentageChange > 0;
  
  let spentChangeColor = 'text-yellow-500';
  if (Math.abs(spentPercentageChange) >= 15) {
    spentChangeColor = isSpentUp ? 'text-destructive' : 'text-green-500';
  }

  // Top Category
  const categoryTotals = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || { amount: 0, count: 0 });
    acc[t.category].amount += t.amount;
    acc[t.category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number, count: number }>);

  let topCategory = '-';
  let topCategoryStats = { amount: 0, count: 0 };
  for (const cat in categoryTotals) {
    if (categoryTotals[cat].amount > topCategoryStats.amount) {
      topCategory = cat;
      topCategoryStats = categoryTotals[cat];
    }
  }

  // Largest Expense
  let largestExpense: any = null;
  if (currentMonthExpenses.length > 0) {
    largestExpense = currentMonthExpenses.reduce((max, t) => t.amount > max.amount ? t : max, currentMonthExpenses[0]);
  }

  // --- Filtering Logic ---
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));
  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'All Types' && filterType.toLowerCase() !== t.type) return false;
    if (filterCategory !== 'All Categories' && filterCategory !== t.category) return false;
    
    if (filterMonth === 'This Month') {
      const d = new Date(t.date);
      if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return false;
    } else if (filterMonth === 'Last Month') {
      const d = new Date(t.date);
      if (d.getMonth() !== lastMonthDate.getMonth() || d.getFullYear() !== lastMonthDate.getFullYear()) return false;
    } else if (filterMonth === 'Last 3 Months') {
      const d = new Date(t.date);
      const diffMonths = (currentYear - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
      if (diffMonths < 0 || diffMonths > 3) return false;
    }
    
    return true;
  });

  const filterOptionsClass = "flex h-11 items-center justify-between bg-surface/50 text-foreground border border-border/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none flex-1 cursor-pointer hover:bg-surface/70 transition-colors";

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-playfair text-4xl font-bold text-primary tracking-tight">{t("Transactions")}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{t("Review your financial activity.")}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2 shadow-md">
          <Plus className="w-4 h-4" />
          {t("Add Transaction")}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="flex flex-col justify-between h-40 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{t("Total Spent This Month")}</h3>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-3xl font-bold text-foreground mb-1">
              {currency}{totalSpentThisMonth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <span className={cn("text-xs font-medium flex items-center gap-1", spentChangeColor)}>
              {isSpentUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(spentPercentageChange).toFixed(0)}% from last month
            </span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{t("Top Category")}</h3>
            <div className="bg-accent/10 p-2 rounded-full text-accent">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-3xl font-bold text-foreground mb-1 truncate">
              {topCategory}
            </div>
            {topCategory !== '-' && (
              <span className="text-xs font-medium text-muted-foreground">
                {topCategoryStats.count} transactions ({currency}{topCategoryStats.amount.toFixed(2)})
              </span>
            )}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{t("Largest Expense")}</h3>
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-playfair text-3xl sm:text-4xl font-bold text-foreground mb-2 truncate" title={largestExpense ? (largestExpense.note || largestExpense.category) : ''}>
              {largestExpense ? (largestExpense.note ? largestExpense.note.replace('Funded goal: ', '') : largestExpense.category) : '-'}
            </div>
            {largestExpense && (
              <span className="text-xs font-medium text-muted-foreground">
                {format(parseISO(largestExpense.date), 'MMM do')} ({currency}{largestExpense.amount.toFixed(2)})
              </span>
            )}
          </div>
        </Card>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-4"
      >
        <DropdownMenu>
          <DropdownMenuTrigger className={filterOptionsClass}>
            <span>{filterMonth}</span>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
            <DropdownMenuRadioGroup value={filterMonth} onValueChange={setFilterMonth}>
              <DropdownMenuRadioItem value="This Month">{t("This Month")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Last Month">{t("Last Month")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Last 3 Months">{t("Last 3 Months")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="All Time">{t("All Time")}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger className={filterOptionsClass}>
            <span className="truncate">{filterCategory}</span>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50 flex-shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] max-h-[300px] overflow-y-auto">
            <DropdownMenuRadioGroup value={filterCategory} onValueChange={setFilterCategory}>
              <DropdownMenuRadioItem value="All Categories">All Categories</DropdownMenuRadioItem>
              {uniqueCategories.map(cat => (
                <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={filterOptionsClass}>
            <span>{filterType}</span>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
            <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
              <DropdownMenuRadioItem value="All Types">{t("All Types")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Expense">{t("Expense")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Income">{t("Income")}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <Card className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground text-xs uppercase tracking-wider bg-surface/30">
                <th className="px-6 py-4 font-semibold">{t("Date")}</th>
                <th className="px-6 py-4 font-semibold">{t("Description")}</th>
                <th className="px-6 py-4 font-semibold">{t("Category")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Amount")}</th>
                <th className="px-6 py-4 font-semibold text-right">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading && filteredTransactions.length === 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border/20 last:border-0">
                      <td colSpan={5} className="py-4 px-6"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ))}
                </>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted-foreground py-12">{t("No transactions found matching your filters.")}</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/20 hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4 text-muted-foreground">{format(parseISO(tx.date), 'MMM do, yyyy')}</td>
                    <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">{tx.note || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-[11px] rounded-full uppercase tracking-wider font-bold bg-secondary/20 text-secondary">
                        {tx.category}
                      </span>
                    </td>
                    <td className={cn("px-6 py-4 text-right font-medium", tx.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10 inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-3 bg-surface/30">
          {loading && filteredTransactions.length === 0 ? (
             [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
             ))
          ) : filteredTransactions.length === 0 ? (
             <div className="text-center text-muted-foreground py-8">{t("No transactions found matching your filters.")}</div>
          ) : (
             filteredTransactions.map((tx) => (
               <div key={tx.id} className="p-4 rounded-xl bg-surface/50 border border-border/40 flex flex-col gap-3 shadow-sm">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="font-semibold text-foreground mb-1 leading-tight">{tx.note || '-'}</p>
                     <p className="text-xs text-muted-foreground">{format(parseISO(tx.date), 'MMM do, yyyy')}</p>
                   </div>
                   <div className={cn("font-medium text-lg", tx.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                     {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-center pt-3 border-t border-border/20">
                   <div className="flex items-center gap-2">
                     <span className="inline-block px-3 py-1 text-[11px] rounded-full uppercase tracking-wider font-bold bg-secondary/20 text-secondary">
                       {tx.category}
                     </span>
                   </div>
                   <button
                     onClick={() => handleDelete(tx.id)}
                     className="text-muted-foreground hover:text-destructive p-2 rounded-full transition-colors hover:bg-destructive/10"
                     title="Delete"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             ))
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

