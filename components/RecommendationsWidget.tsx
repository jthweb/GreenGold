import React from 'react';
import { SparklesIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const RecommendationsWidget: React.FC = () => {
    const { t } = useLocalization();

    const recommendations = [
        t('recFertigate'),
        t('recPests'),
        t('recIrrigate')
    ];

    return (
        <div className="flex flex-col justify-between h-full">
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('topRecommendations')}</h3>
                {/* FIX: Replaced inline style with a Tailwind CSS class `text-[#D4A22E]` to set the color, as the component does not accept a `style` prop. */}
                <SparklesIcon className="w-5 h-5 text-[#D4A22E]" />
            </div>
            <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-slate-700 dark:text-slate-200 list-disc list-inside">
                       {rec}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecommendationsWidget;