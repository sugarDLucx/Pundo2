"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface/50 w-full py-16 border-t border-border/40">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 max-w-7xl mx-auto gap-8">
        <div className="flex items-center gap-2">
          <span className="font-playfair text-2xl font-bold text-primary">Pundo.</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="#" className="text-xs font-semibold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-xs font-semibold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="text-xs font-semibold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Contact</Link>
          <Link href="#" className="text-xs font-semibold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Membership</Link>
        </div>
        
        <div className="text-xs font-medium text-foreground/50">
          © {new Date().getFullYear()} Pundo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
