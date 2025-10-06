// FIX: This file was created to display a market analysis widget on the dashboard.
import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface MarketAnalysisWidgetProps {
    crops: string;
}

const MarketAnalysisWidget: React.FC<MarketAnalysisWidgetProps> = ({ crops }) => {
    const { t } = useLocalization();
    
    const cropList = crops.split(',').map(c => c.trim()).filter(Boolean);

    const marketData = cropList.map((crop, index) => {
        // Simple seeded random for consistent trends
        const trend = (crop.length + index) % 2 === 0 ? 'up' : 'down';
        const change = (Math.random() * 2 + 0.5).toFixed(1);
        return {
            crop: crop,
            trend: trend,
            change: `${trend === 'up' ? '+' : '-'}${change}%`,
            color: trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        };
    });
    
    if (marketData.length === 0) {
         return (
             <div className="h-full flex flex-col justify-center items-center text-center">
                 <p className="text-sm text-slate-500 dark:text-slate-400">No crops to analyze.</p>
             </div>
        )
    }
    
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