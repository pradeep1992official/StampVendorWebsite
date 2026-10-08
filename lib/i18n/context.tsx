'use client';

import React, { createContext, useContext, useSyncExternalStore, useEffect } from 'react';
import { en, TranslationDictionary } from './en';
import { ta } from './ta';

type Language = 'en' | 'ta';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

let memoryLang: Language = 'en';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener('tn_lang_change', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('tn_lang_change', handler);
  };
}

function getSnapshot(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('tn_stamp_lang');
    return saved === 'ta' ? 'ta' : 'en';
  } catch {
    return memoryLang;
  }
}

function getServerSnapshot(): Language {
  return 'en';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Language) => {
    memoryLang = newLang;
    try {
      localStorage.setItem('tn_stamp_lang', newLang);
      window.dispatchEvent(new Event('tn_lang_change'));
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
