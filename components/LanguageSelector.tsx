import React from 'react';
import { LogoIcon } from './Icons';
import { languages } from '../constants/languages';

interface LanguageSelectorProps {
  onLanguageSelect: (langCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {

  const handleSelect = (langCode: string) => {
    onLanguageSelect(langCode);
  };

  return (
    <div className="fixed inset-0 bg-[#141615] flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
      <div className="text-center w-full max-w-2xl mx-auto">
        <LogoIcon className="w-24 h-24 mx-auto mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }} />
        <h1 className="text-3xl font-bold text-slate-200 mb-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          Welcome to GreenGold
        </h1>
        <p className="text-slate-400 mb-8 opacity-0 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
          Please select your preferred language to get started.
        </p>
        
        <div className="max-h-[50vh] overflow-y-auto pr-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="bg-[#2a3831] text-slate-200 p-4 rounded-lg font-semibold transition-all transform hover:scale-105 hover:bg-[#38483e] focus:outline-none focus:ring-2 focus:ring-[#D4A22E]"
                style={{ animation: `slide-in-up 0.5s ease-out ${300 + index * 40}ms forwards`, opacity: 0 }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;