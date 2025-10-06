import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Define the shape of the context
interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  // FIX: Added isLoaded to the context type.
  isLoaded: boolean;
}

// Create the context with a default value
export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Define the provider component
export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en'); // Always default to English on start
  const [translations, setTranslations] = useState<Record<string, string>>({});
  // FIX: Added isLoaded state to track translation loading.
  const [isLoaded, setIsLoaded] = useState(false);

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
    } finally {
        // FIX: Set isLoaded to true after translations are fetched.
        setIsLoaded(true);
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

  // The translation function `t` with placeholder support
  const t = (key: string, replacements: Record<string, string | number> = {}): string => {
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(rKey => {
        const regex = new RegExp(`{${rKey}}`, 'g');
        translation = translation.replace(regex, String(replacements[rKey]));
    });
    return translation;
  };

  const value = {
    language,
    setLanguage,
    t,
    // FIX: Expose isLoaded in the context value.
    isLoaded,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};