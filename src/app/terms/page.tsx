import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground antialiased bg-background">
      <main className="flex-grow py-24 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <Link href="/" className="inline-block mb-12 group">
          <div className="flex items-center space-x-3 cursor-pointer">
            <img src="/logo.png" alt="Pundo Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-playfair text-2xl font-bold text-primary tracking-tight">Pundo</span>
          </div>
        </Link>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">The rules of our exclusive club.</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 space-y-8">
            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">1. The Golden Rule</h2>
              <p>By using Pundo, you agree to always dream big, communicate openly, and never give up on the goals we set together.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">2. Financial Accountability</h2>
              <p>You agree that all funds allocated to "Date Night Reserves" must strictly be used for creating unforgettable memories, eating good food, and spending quality time together.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">3. Lifetime Subscription</h2>
              <p>Your subscription to this partnership is non-refundable, non-transferable, and valid for a lifetime. Termination of this agreement is strictly prohibited.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">4. Support Clauses</h2>
              <p>In the event of a technical issue, a bad day, or financial stress, you are entitled to unlimited hugs, a listening ear, and 24/7 priority support from the sole developer.</p>
            </section>
          </div>
          
          <div className="pt-12 border-t border-border/40 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </main>
    </div>
  );
}
