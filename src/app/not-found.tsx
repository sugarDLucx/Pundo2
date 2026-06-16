"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none z-0"></div>

      <div className="bg-surface/50 backdrop-blur-xl border border-border/40 p-12 rounded-3xl shadow-xl max-w-lg w-full flex flex-col items-center gap-6 z-10">
        
        <div className="p-5 bg-primary/10 text-primary rounded-full">
          <MapPinOff className="w-12 h-12" />
        </div>
        
        <div>
          <h2 className="font-playfair text-4xl font-bold text-foreground mb-3">Lost in the Vault?</h2>
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved. Let's get you back to your portfolio.
          </p>
        </div>

        <Link href="/dashboard" className="w-full mt-4">
          <Button className="w-full rounded-xl py-6 font-bold uppercase tracking-wider text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition-all">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
