
import React from 'react';
import { SalinityIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const SalinityWidget: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('salinityEC')}</h3>
                    <SalinityIcon className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">1.8 <span className="text-lg">dS/m</span></p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('slightlySaline')}</p>
        </div>
    );
};

export default SalinityWidget;
