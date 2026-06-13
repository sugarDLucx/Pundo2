"use client";

import React, { useEffect, useState } from 'react';
import { format, differenceInMonths, differenceInDays } from 'date-fns';
import { Plus, Trophy, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GoalForm } from '@/components/goals/GoalForm';
import { AddFundsForm } from '@/components/goals/AddFundsForm';
import { useGoalStore } from '@/store/goalStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { cn } from '@/lib/utils';

export default function GoalsPage() {
  const { goals, loading, fetchGoals, deleteGoal } = useGoalStore();
  const { profile } = useProfileStore();
  const currency = profile?.currency || '₱';
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [addFundsTarget, setAddFundsTarget] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-accent';
    if (percentage >= 50) return 'text-primary';
    return 'text-muted-foreground';
  };

  const totalSaved = goals.reduce((acc, goal) => acc + goal.current_amount, 0);
  const activeGoalsCount = goals.filter(g => g.current_amount < g.target_amount).length;
  
  const filteredGoals = goals.filter(g => {
    const isCompleted = g.current_amount >= g.target_amount;
    return showCompleted ? true : !isCompleted;
  });
  
  let onTrackCount = 0;
  let needsAttentionCount = 0;

  goals.forEach(goal => {
    const percentage = (goal.current_amount / goal.target_amount) * 100;
    if (percentage >= 100) {
      onTrackCount++;
      return;
    }
    
    const startDate = goal.created_at ? new Date(goal.created_at) : new Date();
    const targetDate = new Date(goal.target_date);
    const currentDate = new Date();
    
    const totalDays = differenceInDays(targetDate, startDate) || 1;
    const elapsedDays = differenceInDays(currentDate, startDate);
    const timePercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    if (percentage >= timePercentage) {
      onTrackCount++;
    } else {
      needsAttentionCount++;
    }
  });

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-playfair text-4xl font-bold text-primary tracking-tight">Financial Goals</h2>
          <p className="text-muted-foreground mt-1 text-sm">Track and manage your savings targets.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowCompleted(!showCompleted)}
            className="rounded-full"
          >
            {showCompleted ? 'Hide Completed' : 'View Completed'}
          </Button>
          <Button onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2 shadow-md">
            <Plus className="w-4 h-4" />
            Create Goal
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col justify-center p-8 bg-surface/30">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Total Saved Towards Goals</h3>
          <div className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-2">
            {currency}{totalSaved.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </Card>
        <Card className="flex flex-col justify-center p-8 bg-surface/30">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Active Goals</h3>
          <div className="font-playfair text-4xl sm:text-5xl font-bold text-foreground mb-3">
            {activeGoalsCount}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">On Track: {onTrackCount}</span>
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">Needs Attention: {needsAttentionCount}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && goals.length === 0 ? (
          <>
            <Card className="p-6"><Skeleton className="h-32 w-full" /></Card>
            <Card className="p-6"><Skeleton className="h-32 w-full" /></Card>
          </>
        ) : filteredGoals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {goals.length === 0 ? 'No goals found. Create one to start saving!' : 'No active goals. You can view your completed goals.'}
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            const isCompleted = percentage >= 100;
            const progressColorText = getProgressColor(goal.current_amount, goal.target_amount);
            
            const targetDate = new Date(goal.target_date);
            const monthsRemaining = Math.max(1, differenceInMonths(targetDate, new Date()));
            const amountNeeded = Math.max(0, goal.target_amount - goal.current_amount);
            const monthlyAmount = amountNeeded / monthsRemaining;

            return (
              <Card key={goal.id} className="flex flex-col gap-6 relative p-6 bg-surface/50">
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground rounded-full p-2 shadow-lg">
                    <Trophy className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-playfair text-2xl font-bold text-foreground line-clamp-1" title={goal.name}>
                      {goal.name}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      Target Date: {goal.target_date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-destructive/10"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 flex-1 justify-center">
                  <div className="flex justify-between items-end">
                    <span className="font-semibold text-foreground">
                      {currency}{goal.current_amount.toFixed(2)} / {currency}{goal.target_amount.toFixed(2)}
                    </span>
                    <span className={cn("font-bold", progressColorText)}>
                      {percentage}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={percentage} 
                    variant={isCompleted ? 'success' : 'primary'} 
                  />
                </div>

                <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <CalendarIcon className="w-4 h-4" />
                    {format(targetDate, 'MMM yyyy')}
                  </div>
                  {!isCompleted && (
                    <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold">
                      +{currency}{monthlyAmount.toFixed(0)}/mo
                    </div>
                  )}
                </div>

                <Button
                  variant={isCompleted ? "outline" : "default"}
                  className="w-full mt-auto rounded-full"
                  onClick={() => setAddFundsTarget(goal.id)}
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Goal Completed' : 'Add Funds'}
                </Button>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Create New Goal"
      >
        <GoalForm onSuccess={() => setIsGoalModalOpen(false)} onCancel={() => setIsGoalModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!addFundsTarget}
        onClose={() => setAddFundsTarget(null)}
        title="Add Funds to Goal"
      >
        {addFundsTarget && (
          <AddFundsForm 
            goalId={addFundsTarget} 
            onSuccess={() => setAddFundsTarget(null)} 
            onCancel={() => setAddFundsTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}
