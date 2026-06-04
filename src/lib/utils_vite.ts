
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_THEMES: Record<string, string> = {
  'Food & Dining': 'bg-primary/20 text-primary',
  'Housing': 'bg-tertiary/20 text-tertiary',
  'Transportation': 'bg-secondary/20 text-secondary',
  'Salary': 'bg-[rgba(16,185,129,0.2)] text-[rgb(16,185,129)]',
  'Entertainment': 'bg-error-container text-error',
  'Utilities': 'bg-[rgba(255,100,50,0.2)] text-[rgb(255,100,50)]',
  'Health': 'bg-blue-900/30 text-blue-400',
  'Other': 'bg-surface-container-high text-on-surface-variant'
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Food & Dining': 'restaurant',
  'Housing': 'home',
  'Transportation': 'directions_car',
  'Salary': 'payments',
  'Entertainment': 'movie',
  'Utilities': 'bolt',
  'Health': 'medical_services',
  'Other': 'category'
};
