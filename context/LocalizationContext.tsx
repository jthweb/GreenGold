import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Define the shape of the context
interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

// Create the context with a default value
export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Define the provider component
export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en'); // Always default to English on start
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const RTL_LANGUAGES = ['ar'];

  // Function to load translations for the current language
  const loadTranslations = useCallback(async (lang: string) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load translations for ${lang}`);
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(error);
      // Fallback to English if the selected language file fails to load
      if (lang !== 'en') {
        await loadTranslations('en');
      }
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
    // Set document direction for RTL languages
    if (RTL_LANGUAGES.includes(language)) {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language, loadTranslations]);

  // Function to change the language
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  // The translation function `t`
  const t = (key: string): string => {
    return translations[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};