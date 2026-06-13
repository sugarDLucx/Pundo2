"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Pundo Logo" className="w-8 h-8 object-contain" />
          <span className="font-playfair text-2xl font-bold text-primary">Pundo.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#faq" className="text-foreground/80 hover:text-foreground transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="hidden md:flex">Log in</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
