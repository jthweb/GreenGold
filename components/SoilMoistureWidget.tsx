import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { DropletIcon } from './Icons';

interface SoilMoistureWidgetProps {
    moisture: number;
    setMoisture: React.Dispatch<React.SetStateAction<number>>;
}

const SoilMoistureWidget: React.FC<SoilMoistureWidgetProps> = ({ moisture, setMoisture }) => {
    const { t } = useLocalization();
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (moisture / 100) * circumference;

    const getStatus = (m: number) => {
        if (m < 30) return { text: t('dry'), color: 'text-red-500', stroke: '#ef4444' };
        if (m <= 70) return { text: t('optimal'), color: 'text-green-500', stroke: '#22c55e' };
        return { text: t('wet'), color: 'text-blue-500', stroke: '#3b82f6' };
    };

    const status = getStatus(moisture);

    return (
        <div className="flex flex-col items-center justify-between h-full text-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-slate-200 dark:text-slate-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50%"
                        cy="50%"
                    />
                    <circle
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50%"
                        cy="50%"
                        style={{ stroke: status.stroke, transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <DropletIcon className={`w-6 h-6 mb-1 transition-colors ${status.color}`} />
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{moisture.toFixed(0)}%</span>
                </div>
            </div>
            <p className={`text-sm font-semibold mt-2 transition-colors ${status.color}`}>{status.text}</p>
        </div>
    );
};

export default SoilMoistureWidget;
