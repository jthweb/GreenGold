

import React from 'react';
import { PlusIcon, FlaskIcon, SunIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const ActionButton: React.FC<{ icon: React.FC<{className?: string}>, label: string }> = ({ icon: Icon, label }) => (
    <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full h-full">
        <Icon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
        <span className="text-xs font-semibold text-center text-slate-700 dark:text-slate-200">{label}</span>
    </button>
);

const ActionsWidget: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="grid grid-cols-3 gap-2 h-full items-stretch">
            <ActionButton icon={PlusIcon} label={t('newLog')} />
            <ActionButton icon={FlaskIcon} label={t('soilTest')} />
            <ActionButton icon={SunIcon} label={t('weather')} />
        </div>
    );
};

export default ActionsWidget;
