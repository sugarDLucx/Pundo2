"use client";

import React from 'react';
import { parseDate, CalendarDate } from '@internationalized/date';
import { DialogTrigger, Button as ButtonRac, Popover, Dialog } from 'react-aria-components';
import { Calendar } from './calendar';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Convert string "YYYY-MM-DD" to CalendarDate for react-aria
  let dateValue = undefined;
  try {
    if (value) dateValue = parseDate(value);
  } catch(e) {
    // ignore
  }

  const handleChange = (date: any) => {
    onChange(date.toString());
    setIsOpen(false);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <ButtonRac className={cn(
        "flex h-11 w-full items-center justify-between rounded-md border border-border/40 bg-surface/50 px-3 py-2 text-sm ring-offset-background hover:bg-surface/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        !value && "text-muted-foreground",
        className
      )}>
        {value ? format(parseISO(value), 'PPP') : "Pick a date"}
        <CalendarIcon className="h-4 w-4 opacity-50" />
      </ButtonRac>
      
      <Popover 
        placement="bottom start" 
        className="z-50 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none bg-background"
      >
        <Dialog className="outline-none p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Calendar value={dateValue} onChange={handleChange} />
          </motion.div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
