"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { translations } from '@/lib/i18n';

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useProfileStore();
  const language = profile?.language || 'English (United States)';

  const t = (key: string) => {
    const dict = translations[language] || translations["English (United States)"];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};
