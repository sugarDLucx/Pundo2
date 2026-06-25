"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Turnstile } from '@marsidev/react-turnstile';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, error: authError } = useAuthStore();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signUp(email, password, fullName, captchaToken);
      // Depending on Supabase settings, this might log them in, or require email verification.
      // Usually, if auto-confirm is enabled, they are logged in.
      // Let's redirect to sign-in or dashboard based on typical flows. 
      // We will redirect to dashboard, if they aren't logged in, dashboard middleware handles it.
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground antialiased relative overflow-x-hidden bg-background">
      
      {/* Subtle organic background decoration */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(204, 167, 48, 0.05) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(66, 0, 147, 0.03) 0%, transparent 50%)'
        }}
      />
      
      {/* Ambient decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none z-0"></div>
      
      <main className="flex-grow flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-3 cursor-pointer group mb-8">
                <Image src="/logo.png" alt="Pundo Logo" width={48} height={48} className="object-contain group-hover:scale-105 transition-transform" />
              </div>
            </Link>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">Begin Your Journey</h1>
            <p className="text-lg text-muted-foreground">Curate your wealth with intention.</p>
          </div>
          
          {/* Sign Up Form Card */}
          <div className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/40 p-8 shadow-[0_8px_32px_rgba(66,0,147,0.05)]">
            <form onSubmit={handleSignUp} className="space-y-6">
              
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="fullName">
                  Full Name
                </label>
                <input 
                  id="fullName" 
                  name="fullName" 
                  type="text" 
                  placeholder="Jane Doe" 
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-surface border border-border/40 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors placeholder:text-muted-foreground shadow-sm"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="jane@example.com" 
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border/40 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors placeholder:text-muted-foreground shadow-sm"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-surface border border-border/40 rounded-xl px-4 py-3 pr-12 text-foreground text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors placeholder:text-muted-foreground shadow-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters.</p>
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg mt-4">
                  {error || authError}
                </div>
              )}

              {/* Submit Button */}
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div className="flex justify-center mt-4">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setCaptchaToken(token)}
                  />
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading || googleLoading}
                className="w-full bg-primary text-primary-foreground rounded-xl py-4 text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all duration-200 mt-8 shadow-md disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-8 relative flex items-center">
              <div className="flex-grow border-t border-border/40"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-muted-foreground uppercase bg-background px-2">
                Or continue with
              </span>
              <div className="flex-grow border-t border-border/40"></div>
            </div>

            {/* Social Auth */}
            <button 
              type="button" 
              onClick={handleGoogleSignUp}
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
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Sign up with Google</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-accent font-semibold hover:brightness-110 transition-colors border-b border-transparent hover:border-accent pb-0.5">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
