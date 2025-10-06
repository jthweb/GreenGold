import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { ChevronLeftIcon } from './Icons';

interface SettingsPanelProps {
    onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onBack }) => {
    const { t } = useLocalization();

    return (
        <div className="absolute inset-0 bg-slate-100 dark:bg-[#141615] z-50 flex flex-col animate-fade-in">
             <header className="flex-shrink-0 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 h-16 flex items-center px-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-[#4A5C50] dark:text-slate-200 mx-auto">{t('settings')}</h2>
                <div className="w-10"></div> {/* Spacer */}
            </header>
            <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-500">{t('settings')} {t('comingSoon')}</p>
            </div>
        </div>
    );
};

export default SettingsPanel;
