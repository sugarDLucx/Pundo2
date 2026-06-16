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

  return <>{children}</>;
}
