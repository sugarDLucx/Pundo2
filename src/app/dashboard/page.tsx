/* eslint-disable */
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { useTransactionStore } from '@/store/transactionStore';
import { useGoalStore } from '@/store/goalStore';
import { useProfileStore } from '@/store/profileStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { 
  GripVertical, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSection({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };
  return (
    <div ref={setNodeRef} style={style} className="group/section relative mb-6">
      <div 
        className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors z-20 hidden md:block opacity-0 group-hover/section:opacity-100" 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { transactions, loading, fetchTransactions } = useTransactionStore();
  const { goals, loading: goalsLoading, fetchGoals } = useGoalStore();
  const { profile, updateProfile } = useProfileStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const currency = profile?.currency || 'â‚±';

  const [layout, setLayout] = useState<string[]>(['overview', 'charts', 'goals', 'transactions']);
  const [timeframe, setTimeframe] = useState<number>(6);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchGoals();
    }
    
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome_v2');
    if (!hasSeenWelcome) {
      addNotification('Welcome to Pundo 2.0! ✨', 'Experience the new Luxe design. Your financial dashboard is ready.', 'info');
      localStorage.setItem('hasSeenWelcome_v2', 'true');
    }
  }, [user, fetchTransactions, fetchGoals, addNotification]);

  useEffect(() => {
    if (profile?.dashboard_layout && Array.isArray(profile.dashboard_layout) && profile.dashboard_layout.length > 0) {
      setLayout(profile.dashboard_layout);
    }
  }, [profile?.dashboard_layout]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.indexOf(active.id as string);
      const newIndex = layout.indexOf(over.id as string);
      const newLayout = arrayMove(layout, oldIndex, newIndex);
      setLayout(newLayout);
      try {
        await updateProfile({ dashboard_layout: newLayout });
      } catch(e) {
        // Silently fail if guest user
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { totalIncome, totalExpense, balance, chartData, categoryData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categories: Record<string, number> = {};
    const now = new Date();
    const chartMonths = Array.from({ length: timeframe }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        month: d.toLocaleString('default', { month: 'short' }),
        income: 0,
        expense: 0
      };
    }).reverse();

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        inc += tx.amount;
      } else {
        exp += tx.amount;
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      }

      const txDate = new Date(tx.date);
      const mData = chartMonths.find(m => m.monthIndex === txDate.getMonth() && m.year === txDate.getFullYear());
      if (mData) {
        if (tx.type === 'income') mData.income += tx.amount;
        else mData.expense += tx.amount;
      }
    });

    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp,
      chartData: chartMonths,
      categoryData: Object.entries(categories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    };
  }, [transactions, timeframe]);

  const CHART_COLORS = ['#420093', '#D4AF37', '#B2912D', '#2d3748', '#a0aec0', '#4a5568'];

  const sections: Record<string, React.ReactNode> = {
    overview: (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between h-40 p-6 relative overflow-hidden group border border-primary/20 bg-gradient-to-br from-surface to-primary/5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between z-10">
            Total Balance
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Wallet className="w-5 h-5" />
            </div>
          </h3>
          <div className="font-playfair text-4xl sm:text-5xl font-bold text-foreground z-10 tracking-tight">
            {loading ? <Skeleton className="h-10 w-32 mt-2" /> : <>{balance < 0 ? '-' : ''}{currency}{Math.abs(balance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40 p-6 border border-border/40 bg-surface/50">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between">
            Total Income
            <div className="bg-green-500/10 p-2 rounded-full text-green-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </h3>
          <div className="font-playfair text-3xl sm:text-4xl font-bold text-foreground">
            {loading ? <Skeleton className="h-8 w-28 mt-2" /> : <>{currency}{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40 p-6 border border-border/40 bg-surface/50">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-between">
            Total Expenses
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <TrendingDown className="w-5 h-5" />
            </div>
          </h3>
          <div className="font-playfair text-3xl sm:text-4xl font-bold text-foreground">
            {loading ? <Skeleton className="h-8 w-28 mt-2" /> : <>{currency}{totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>}
          </div>
        </Card>
      </section>
    ),
    charts: (
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 min-h-[360px] flex flex-col p-6 border border-border/40 bg-surface/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-playfair text-2xl font-bold text-foreground">Income vs Expenses</h3>
            <select 
              value={timeframe} 
              onChange={e => setTimeframe(Number(e.target.value))}
              className="bg-background text-foreground border border-border/40 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-end gap-2 pb-4">
                {[...Array(timeframe)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-3/4 rounded-t-md opacity-50" style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis width={80} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(val) => val >= 1000000 ? `${currency}${(val/1000000).toFixed(1)}M` : val >= 1000 ? `${currency}${(val/1000).toFixed(1)}k` : `${currency}${val}`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(66, 0, 147, 0.05)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border/40 rounded-xl p-3 shadow-md min-w-[120px]">
                            <p className="text-foreground font-semibold mb-2">{label}</p>
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className="flex justify-between items-center gap-6 text-sm font-bold" style={{ color: entry.dataKey === 'income' ? '#22c55e' : '#ef4444' }}>
                                <span className="capitalize">{entry.name}</span>
                                <span>{currency}{Number(entry.value).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="income" fill="#420093" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col flex-1 p-6 border border-border/40 bg-surface/50">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">Category Breakdown</h3>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="w-48 h-48 rounded-full opacity-50" />
              </div>
            ) : categoryData.length > 0 ? (
              <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 py-2">
                <div className="w-full h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(val: any) => `${currency}${Number(val).toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-bold text-xl text-foreground">100%</span>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  {categoryData.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                        <span className="text-sm font-medium text-muted-foreground truncate" title={entry.name}>{entry.name}</span>
                      </div>
                      <span className="text-sm text-foreground font-bold shrink-0">
                        {Math.round((entry.value / totalExpense) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                No expense data
              </div>
            )}
          </Card>
        </div>
      </section>
    ),
    goals: (
      <section>
        <Card className="flex flex-col gap-4 p-6 border border-border/40 bg-surface/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-playfair text-2xl font-bold text-foreground">Active Goals</h3>
            <Link href="/dashboard/goals" className="text-primary text-sm font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {goalsLoading && goals.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full opacity-50" />
              <Skeleton className="h-32 w-full hidden md:block opacity-50" />
            </div>
          ) : goals.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              No active goals. Start saving today!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.slice(0, 2).map((goal) => {
                const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
                return (
                  <div key={goal.id} className="bg-background border border-border/40 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-foreground truncate">{goal.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {currency}{goal.current_amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} / {currency}{goal.target_amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                        </p>
                      </div>
                      <span className="text-sm text-primary font-bold">{percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    ),
    transactions: (
      <section>
        <Card className="overflow-x-auto p-6 border border-border/40 bg-surface/50">
          <div className="flex justify-between items-center mb-6 min-w-full">
            <h3 className="font-playfair text-2xl font-bold text-foreground">Recent Transactions</h3>
            <Link href="/dashboard/transactions" className="text-primary text-sm font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Description</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading && transactions.length === 0 ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <tr key={i} className="border-b border-border/20 last:border-0">
                        <td colSpan={4} className="py-4"><Skeleton className="h-8 w-full opacity-50" /></td>
                      </tr>
                    ))}
                  </>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted-foreground py-8">No transactions yet</td>
                  </tr>
                ) : (
                  transactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="border-b border-border/20 hover:bg-primary/5 transition-colors group last:border-0">
                      <td className="py-4 text-muted-foreground">{tx.date}</td>
                      <td className="py-4 font-medium text-foreground group-hover:text-primary transition-colors">{tx.note || '—'}</td>
                      <td className="py-4">
                        <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[10px] rounded-full uppercase font-bold tracking-wider">
                          {tx.category}
                        </span>
                      </td>
                      <td className={cn("py-4 text-right font-bold", tx.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                        {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
             {loading && transactions.length === 0 ? (
                [...Array(3)].map((_, i) => (
                   <Skeleton key={i} className="h-20 w-full rounded-xl opacity-50" />
                ))
             ) : transactions.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">No transactions yet</div>
             ) : (
                transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="p-4 rounded-xl bg-background border border-border/40 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">{tx.note || '—'}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded uppercase tracking-wider">
                          {tx.category}
                        </span>
                        <span className="text-muted-foreground text-xs">{tx.date}</span>
                      </div>
                    </div>
                    <div className={cn("font-bold text-lg", tx.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))
             )}
          </div>
        </Card>
      </section>
    )
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-playfair text-4xl font-bold text-primary tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1 text-sm">Here's your fiscal health at a glance.</p>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout} strategy={verticalListSortingStrategy}>
          {layout.map((id) => (
            <SortableSection key={id} id={id}>
              {sections[id]}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

