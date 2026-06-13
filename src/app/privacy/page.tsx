import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground antialiased bg-background">
      <main className="flex-grow py-24 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <Link href="/" className="inline-block mb-12 group">
          <div className="flex items-center space-x-3 cursor-pointer">
            <Image src="/logo.png" alt="Pundo Logo" width={40} height={40} className="object-contain group-hover:scale-105 transition-transform" />
            <span className="font-playfair text-2xl font-bold text-primary tracking-tight">Pundo</span>
          </div>
        </Link>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Because some things are meant just for us.</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 space-y-8">
            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">1. Our Promise to You</h2>
              <p>Your financial goals, your midnight dreams, and your date night plans are sacred. We promise to protect your data with the same ferocity and dedication that we bring to our relationship.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">2. What We Collect</h2>
              <p>We only collect what is strictly necessary to make your Pundo experience magical:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your goals and aspirations.</li>
                <li>Your uploaded memories (kept securely in our vault).</li>
                <li>Basic account information to keep you connected.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">3. What We Never Do</h2>
              <p>We will never sell your data, your dreams, or your information to any third party. Your trust is our most valuable asset, and we would never compromise it.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-playfair text-2xl font-bold text-foreground">4. The "Us" Exclusivity</h2>
              <p>This platform was built on love, and its privacy reflects that. Only authorized members of our inner circle (meaning: just us) will ever have access to this sanctuary.</p>
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
