// FIX: This file was created to display a crop distribution widget on the dashboard.
import React from 'react';
import DoughnutChart from './DoughnutChart';
import { useLocalization } from '../hooks/useLocalization';

interface CropDistributionWidgetProps {
    crops: string;
}

const COLORS = ['#D4A22E', '#FBBF24', '#4A5C50', '#8D9A92', '#A9907E'];

const CropDistributionWidget: React.FC<CropDistributionWidgetProps> = ({ crops }) => {
    const { t } = useLocalization();
    
    // Create dynamic data from the user's crop list
    const cropList = crops.split(',').map(c => c.trim()).filter(Boolean);
    const distribution = 100 / (cropList.length || 1);
    
    const cropData = cropList.map((crop, index) => ({
        label: crop,
        value: Math.round(distribution),
        color: COLORS[index % COLORS.length]
    }));

    // Adjust last item to ensure total is 100
    if (cropData.length > 0) {
        const sum = cropData.slice(0, -1).reduce((acc, item) => acc + item.value, 0);
        cropData[cropData.length - 1].value = 100 - sum;
    }
    
    if (cropData.length === 0) {
        return (
             <div className="h-full flex flex-col justify-center items-center text-center">
                 <p className="text-sm text-slate-500 dark:text-slate-400">No crops defined.</p>
             </div>
        )
    }

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