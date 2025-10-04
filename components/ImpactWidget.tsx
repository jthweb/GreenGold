

import React from 'react';
import { ArrowTrendingUpIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const ImpactWidget: React.FC = () => {
  const { t } = useLocalization();
  return (
    <div className="h-full flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 sr-only">{t('yourImpact')}</h3>
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-200">{t('yieldIncrease')}</span>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span className="font-semibold text-sm">+12%</span>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-200">{t('waterSaved')}</span>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span className="font-semibold text-sm">+25%</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ImpactWidget;
