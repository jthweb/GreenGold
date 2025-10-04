
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { LogoIcon } from './Icons';
import { languages } from '../constants/languages';

interface LanguageSelectorProps {
  onLanguageSelect: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  const { setLanguage, t } = useLocalization();

  const handleSelect = (langCode: string) => {
    setLanguage(langCode);
    onLanguageSelect();
  };

  return (
    <div className="fixed inset-0 bg-slate-100 dark:bg-[#141615] flex items-center justify-center z-50">
      <div className="text-center p-8">
        <LogoIcon className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-[#4A5C50] dark:text-slate-200 mb-2">
            {t('welcomeTo')} Green<span style={{ color: '#D4A22E' }}>Gold</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{t('selectLanguage')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="p-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-800/60 bg-white/80 dark:bg-[#202a25]/80 hover:bg-slate-50 dark:hover:bg-[#2a3831] text-slate-800 dark:text-slate-200"
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;