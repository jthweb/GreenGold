

import React from 'react';
// FIX: Added the BellAlertIcon to the Icons.tsx file and imported it here to resolve the missing member error.
import { BellAlertIcon, ClockIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const AlertsWidget: React.FC = () => {
    const { t } = useLocalization();
    const alerts = [
        { text: t('alertNitrogen'), time: `2h ${t('ago')}`, level: 'high' },
        { text: t('alertRain'), time: `8h ${t('ago')}`, level: 'medium' },
    ];

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 sr-only">{t('alerts')}</h3>
                <BellAlertIcon className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-3">
                {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.level === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <div>
                            <p className="text-sm text-slate-800 dark:text-slate-100">{alert.text}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <ClockIcon className="w-3 h-3" />
                                <span>{alert.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsWidget;
