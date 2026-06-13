"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

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

  return <>{children}</>;
}
