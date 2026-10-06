'use client';

import React, { createContext, useContext, useState } from 'react';
import { en, TranslationDictionary } from './en';
import { ta } from './ta';

type Language = 'en' | 'ta';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tn_stamp_lang') as Language;
        if (saved === 'en' || saved === 'ta') {
          return saved;
        }
      } catch {
        // Fallback
      }
    }
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('tn_stamp_lang', newLang);
    } catch {
      // Fallback
    }
  };

  const t = lang === 'ta' ? ta : en;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
