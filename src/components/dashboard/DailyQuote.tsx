"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export function DailyQuote() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("/api/quote");
        if (res.ok) {
          const data = await res.json();
          setQuote(data);
        }
      } catch (error) {
        console.error("Failed to fetch quote", error);
      }
    }
    fetchQuote();
  }, []);

  if (!quote) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden lg:flex max-w-sm items-start gap-3 p-4 bg-surface/50 border border-border/40 rounded-2xl shadow-sm backdrop-blur-sm"
    >
      <Quote className="w-6 h-6 text-primary shrink-0 opacity-50 rotate-180 mt-1" />
      <div>
        <p className="text-sm italic text-foreground font-playfair leading-relaxed">
          "{quote.quote}"
        </p>
        <p className="text-xs font-semibold text-primary mt-2">
          — {quote.author}
        </p>
      </div>
    </motion.div>
  );
}
