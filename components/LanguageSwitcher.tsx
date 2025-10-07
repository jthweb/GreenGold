import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { languages } from '../constants/languages';
import { GlobeAltIcon } from './Icons';

interface LanguageSwitcherProps {
    onLanguageChange: (langCode: string) => void;
}

const PRIMARY_LANG_CODES = ['en', 'ar', 'es', 'hi', 'zh', 'fr'];
const primaryLanguages = languages.filter(lang => PRIMARY_LANG_CODES.includes(lang.code));
const otherLanguages = languages.filter(lang => !PRIMARY_LANG_CODES.includes(lang.code));


const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
    const { language } = useLocalization();
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSelect = (langCode: string) => {
        onLanguageChange(langCode);
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    return (
        <div className="relative" ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all text-slate-600 dark:text-slate-300 flex items-center gap-1"
                title="Change language"
            >
                <GlobeAltIcon className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className="absolute end-0 bottom-full mb-2 w-56 bg-white dark:bg-[#2a3831] rounded-lg shadow-xl z-20 ring-1 ring-black ring-opacity-5">
                    <div className="py-1 max-h-72 overflow-y-auto">
                        {primaryLanguages.map(lang => (
                             <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code ? 'font-semibold text-[#D4A22E]' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                {lang.name}
                            </button>
                        ))}
                        {showAll && otherLanguages.map(lang => (
                             <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors animate-fade-in-fast ${language === lang.code ? 'font-semibold text-[#D4A22E]' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700/50 p-1">
                         <button onClick={() => setShowAll(!showAll)} className="w-full text-center px-4 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#D4A22E] font-semibold rounded">
                            {showAll ? 'Show less...' : 'Show all...'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;