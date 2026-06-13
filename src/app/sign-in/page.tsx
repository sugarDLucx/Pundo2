"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, error: authError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Supabase OAuth handles redirect, but we can wait briefly
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex antialiased selection:bg-primary/20 selection:text-primary">
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        
        {/* Left Side: Form Area */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-24 py-12 lg:py-0 relative z-10 bg-background">
          <div className="max-w-md w-full mx-auto space-y-12">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <Image src="/logo.png" alt="Pundo Logo" width={40} height={40} className="object-contain group-hover:scale-105 transition-transform" priority />
                  <span className="font-playfair text-3xl font-bold text-primary tracking-tight">Pundo</span>
                </div>
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground">
                Welcome Back.
              </h1>
              <p className="text-lg text-muted-foreground">
                Please enter your details to access your sanctuary.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    required 
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-surface border border-border/40 rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 placeholder:text-muted-foreground shadow-sm hover:border-border/80"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <Link href="#" className="text-xs font-semibold text-primary hover:text-accent transition-colors underline decoration-primary/30 underline-offset-4">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-surface border border-border/40 rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 placeholder:text-muted-foreground shadow-sm hover:border-border/80"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">
                  {error || authError}
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading || googleLoading}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-primary-foreground bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border/40"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-semibold text-muted-foreground uppercase">Or continue with</span>
                  <div className="flex-grow border-t border-border/40"></div>
                </div>

                <button 
                  type="button" 
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  className="w-full bg-surface border border-border/40 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-muted/50 transition-colors active:scale-[0.98] disabled:opacity-70"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                  )}
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Sign in with Google</span>
                </button>
              </div>

              <div className="pt-4 text-center">
                <Link href="/sign-up" className="text-sm font-medium text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">
                  Don't have an account? Create one
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Lifestyle Image Area */}
        <div className="hidden lg:block lg:w-1/2 relative bg-surface overflow-hidden">
          {/* Decorative overlay to soften the image slightly */}
          <div className="absolute inset-0 bg-primary/5 z-10 mix-blend-multiply pointer-events-none"></div>
          <Image 
            alt="Elegant interior scene" 
            className="object-cover" 
            fill
            priority
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          />
          
          {/* Glassmorphic floating element to add depth */}
          <div className="absolute bottom-12 right-12 z-20 max-w-sm bg-background/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_32px_rgba(66,0,147,0.05)] border border-white/20">
            <p className="font-playfair text-xl text-white font-semibold mb-2">"True wealth is the freedom to curate your life."</p>
            <div className="flex items-center space-x-2 text-white/80 mt-4">
              <div className="w-8 h-[1px] bg-white/80"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Pundo Philosophy</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
