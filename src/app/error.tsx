"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-surface/80 backdrop-blur-xl border border-border/40 p-10 rounded-3xl shadow-xl max-w-md w-full flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-destructive/10 rounded-full mix-blend-screen filter blur-[50px] pointer-events-none z-0"></div>

        <div className="p-4 bg-destructive/10 text-destructive rounded-full z-10">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <div className="z-10">
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-3">Something went wrong</h2>
          <p className="text-muted-foreground text-sm">
            We encountered an unexpected issue while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4 z-10">
          <Button 
            onClick={() => reset()} 
            className="flex-1 rounded-xl py-6 font-bold uppercase tracking-wider"
          >
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full rounded-xl py-6 font-bold uppercase tracking-wider hover:bg-surface"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
