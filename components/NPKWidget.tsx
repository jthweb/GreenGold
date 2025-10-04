import React, { useState } from 'react';
import { FlaskIcon, DropletIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';
import { NPKValues } from '../types';

interface NPKWidgetProps {
    npkValues: NPKValues;
    setNpkValues: React.Dispatch<React.SetStateAction<NPKValues>>;
}

const NutrientBar: React.FC<{ label: string, value: number, max: number, color: string }> = ({ label, value, max, color }) => {
    const percentage = (value / max) * 100;
    const isLow = value < max * 0.4;
    const isHigh = value > max * 0.8;

    let statusColor = 'bg-green-500';
    if (isLow) statusColor = 'bg-red-500';
    if (isHigh) statusColor = 'bg-amber-500';

    return (
        <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-slate-700 dark:text-slate-200 w-4">{label}</span>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%`, transition: 'width 0.8s ease-in-out' }}></div>
            </div>
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400 w-8 text-right">{value}</span>
            <div className={`w-2 h-2 rounded-full ${statusColor} transition-colors`}></div>
        </div>
    );
};

const NPKWidget: React.FC<NPKWidgetProps> = ({ npkValues, setNpkValues }) => {
    const { t } = useLocalization();
    const [isFertilizing, setIsFertilizing] = useState(false);

    const handleFertilize = () => {
        setIsFertilizing(true);
        // Simulate fertilization bringing values to a new ideal state
        setTimeout(() => {
            const idealValues = {
                n: 20 + Math.floor(Math.random() * 5),
                p: 10 + Math.floor(Math.random() * 3),
                k: 18 + Math.floor(Math.random() * 4)
            };
            setNpkValues(idealValues);
        }, 800);

        setTimeout(() => setIsFertilizing(false), 2000);
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="relative">
                 {isFertilizing && (
                    <div className="absolute -top-4 inset-x-0 h-full overflow-hidden pointer-events-none z-10">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <DropletIcon 
                                key={i} 
                                className="absolute w-3 h-3 text-cyan-400/60 fertigate-droplet"
                                style={{
                                    left: `${Math.random() * 95}%`,
                                    animationDelay: `${Math.random() * 1.5}s`,
                                    animationDuration: `${Math.random() * 1 + 0.8}s`
                                }}
                            />
                        ))}
                    </div>
                )}
                <div className="space-y-3">
                    <NutrientBar label={t('n')} value={npkValues.n} max={30} color="bg-blue-500" />
                    <NutrientBar label={t('p')} value={npkValues.p} max={20} color="bg-purple-500" />
                    <NutrientBar label={t('k')} value={npkValues.k} max={25} color="bg-pink-500" />
                </div>
            </div>
            <button
                onClick={handleFertilize}
                disabled={isFertilizing}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FlaskIcon className="w-5 h-5" />
                {isFertilizing ? t('fertigating') : t('fertigate')}
            </button>
        </div>
    );
};

export default NPKWidget;