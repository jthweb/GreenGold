import React from 'react';
import { LogoIcon, MoonIcon, SunIcon, LogoutIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface HeaderProps {
    onToggleTheme: () => void;
    theme: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleTheme, theme, onLogout }) => {
    const { t } = useLocalization();
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 shadow-sm z-40 h-16 flex items-center justify-between px-4 lg:hidden">
            <div className="flex items-center gap-2">
                <LogoIcon className="w-9 h-9" />
                 <h1 className="text-lg font-bold text-[#4A5C50] dark:text-slate-100">
                    Green<span style={{ color: '#D4A22E' }}>Gold</span>
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <button
                  onClick={onToggleTheme}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                  title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
                 <button
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                  title={t('logout')}
                >
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;