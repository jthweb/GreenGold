// FIX: This file was created to display a crop distribution widget on the dashboard.
import React from 'react';
import DoughnutChart from './DoughnutChart';
import { useLocalization } from '../hooks/useLocalization';

const CropDistributionWidget: React.FC = () => {
    const { t } = useLocalization();
    const cropData = [
        { label: t('wheat'), value: 45, color: '#D4A22E' },
        { label: t('maize'), value: 30, color: '#FBBF24' },
        { label: t('soybean'), value: 25, color: '#4A5C50' },
    ];

    return (
        <div className="h-full flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 sr-only">{t('cropDistribution')}</h3>
            <div className="flex items-center justify-center sm:justify-start gap-4">
                <DoughnutChart data={cropData} />
                <div className="space-y-1">
                    {cropData.map(crop => (
                        <div key={crop.label} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }}></div>
                            <span className="text-slate-700 dark:text-slate-200">{crop.label}</span>
                            <span className="ml-auto font-semibold text-slate-500 dark:text-slate-400">{crop.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CropDistributionWidget;
