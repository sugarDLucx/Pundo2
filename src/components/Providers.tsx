"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { usePathname, useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const initialized = useAuthStore((state) => state.initialized);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (initialized && user) {
      fetchProfile();
    }
  }, [initialized, user, fetchProfile]);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (initialized) {
      const isPublicPath = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up';
      if (user && isPublicPath) {
        router.push('/dashboard');
      } else if (!user && !isPublicPath && pathname.startsWith('/dashboard')) {
        router.push('/sign-in');
      }
    }
  }, [initialized, user, pathname, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none z-0"></div>
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-surface shadow-inner"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-accent/20"></div>
          </div>
          <div className="text-center">
            <h2 className="font-playfair text-2xl font-bold text-foreground tracking-widest uppercase mb-2 animate-pulse">
              Pundo
            </h2>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
