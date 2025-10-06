import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useUser } from '../hooks/useUser';
import { ChevronLeftIcon, ArrowLeftOnRectangleIcon } from './Icons';
import LanguageSwitcher from './LanguageSwitcher';

interface SettingsPanelProps {
    onLogout: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onLogout }) => {
    const { t, setLanguage } = useLocalization();
    const { user } = useUser();

    return (
        <div className="p-4 md:p-6 space-y-6">
             <div className="text-center md:hidden">
                <h2 className="text-lg font-bold text-[#4A5C50] dark:text-slate-200">{t('settings')}</h2>
            </div>
            <div className="bg-white dark:bg-[#202a25] p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold mb-3">{t('account')}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{t('name')}</span>
                        <span className="font-medium">{user?.name}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{t('email')}</span>
                        <span className="font-medium">{user?.email}</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-[#202a25] p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold mb-3">{t('preferences')}</h3>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t('language')}</span>
                    <LanguageSwitcher onLanguageChange={setLanguage} />
                </div>
            </div>

            <div className="mt-4">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    {t('logout')}
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;
