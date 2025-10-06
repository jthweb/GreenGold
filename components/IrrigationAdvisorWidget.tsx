import React, { useState, useMemo } from 'react';
import { WifiIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';
import { WeatherCondition } from '../types';

interface IrrigationAdvisorWidgetProps {
    moisture: number;
    weather: WeatherCondition;
    onExplain: (prompt: string) => void;
}

const IrrigationAdvisorWidget: React.FC<IrrigationAdvisorWidgetProps> = ({ moisture, weather, onExplain }) => {
    const { t } = useLocalization();
    const [duration, setDuration] = useState(30); // in minutes

    const advice = useMemo(() => {
        if (weather === 'rainy') {
            return { text: t('irrigationNotNeededRain'), level: 'ok', recommendation: t('monitorDrainage') };
        }
        if (moisture > 70) {
            return { text: t('soilIsSaturated'), level: 'high', recommendation: t('delayIrrigation') };
        }
        if (moisture < 30) {
            return { text: t('soilIsTooDry'), level: 'low', recommendation: t('immediateAction') };
        }
        return { text: t('irrigationOptimal'), level: 'ok', recommendation: t('scheduledRun') };
    }, [moisture, weather, t]);

    const levelColors = {
        low: 'text-red-500',
        ok: 'text-green-500',
        high: 'text-blue-500',
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <p className={`text-sm font-semibold ${levelColors[advice.level as keyof typeof levelColors]}`}>{advice.text}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{advice.recommendation}</p>
            </div>
            <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{t('nextRun')}:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{duration} {t('minutes')}</span>
                </div>
                <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 mt-2 slider-thumb"
                />
            </div>
            <button
                onClick={() => onExplain(t('startIrrigationPrompt', {duration}))}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
            >
                <WifiIcon className="w-5 h-5" />
                {t('startIrrigation')}
            </button>
        </div>
    );
};

export default IrrigationAdvisorWidget;
