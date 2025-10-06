// FIX: This file was created to display a market analysis widget on the dashboard.
import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const MarketAnalysisWidget: React.FC = () => {
    const { t } = useLocalization();
    const marketData = [
        { crop: t('wheat'), trend: 'up', change: '+1.8%', color: 'text-green-600 dark:text-green-400' },
        { crop: t('barley'), trend: 'up', change: '+0.5%', color: 'text-green-600 dark:text-green-400' },
        { crop: t('rapeseed'), trend: 'down', change: '-0.9%', color: 'text-red-600 dark:text-red-400' },
    ];
    
    return (
        <div className="h-full flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 sr-only">{t('marketAnalysis')}</h3>
            <div className="space-y-2">
                {marketData.map(item => (
                    <div key={item.crop} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700 dark:text-slate-200">{item.crop}</span>
                        <div className={`flex items-center gap-1 font-semibold ${item.color}`}>
                            {item.trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
                            <span>{item.change}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketAnalysisWidget;