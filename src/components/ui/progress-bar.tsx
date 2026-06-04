"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  variant?: 'primary' | 'danger' | 'success';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary',
      danger: 'bg-destructive',
      success: 'bg-accent',
    };

    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn("w-full bg-primary/10 rounded-full h-2.5 overflow-hidden", className)}
        {...props}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-2.5 rounded-full shadow-sm", variants[variant])}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
