import React, { useEffect, useRef } from 'react';
import { DropletIcon, PlayIcon, StopIcon, DrainIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';
import { WeatherCondition } from '../types';

interface SoilMoistureWidgetProps {
    moisture: number;
    isIrrigating: boolean;
    isDraining: boolean;
    setMoisture: (value: React.SetStateAction<number>) => void;
    setIsIrrigating: (value: React.SetStateAction<boolean>) => void;
    setIsDraining: (value: React.SetStateAction<boolean>) => void;
    weather: WeatherCondition;
}

const SoilMoistureWidget: React.FC<SoilMoistureWidgetProps> = ({ moisture, isIrrigating, isDraining, setMoisture, setIsIrrigating, setIsDraining, weather }) => {
    const { t } = useLocalization();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isIrrigating) {
            let seconds = 0;
            intervalRef.current = window.setInterval(() => {
                seconds++;
                // Faster rate for the first 5 seconds, then slower
                const increment = seconds <= 5 ? 1 : 1 / 12; // 1% per sec, then 1% per minute (5s*12)
                setMoisture(prev => Math.min(100, prev + increment));
            }, 1000 / (seconds <= 5 ? 1 : 1/12) );

        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isIrrigating, setMoisture]);
    
    useEffect(() => {
        if (moisture >= 100 && isIrrigating) {
            setIsIrrigating(false);
        }
    }, [moisture, isIrrigating, setIsIrrigating]);

    const circumference = 2 * Math.PI * 55; // r = 55
    const isSaturated = moisture > 100;
    const visualMoisture = Math.min(100, moisture);
    const strokeDashoffset = circumference - (visualMoisture / 100) * circumference;

    return (
        <div className="bg-white dark:bg-[#202a25] p-4 rounded-xl shadow-sm flex flex-col justify-between items-center relative overflow-hidden h-full">
            {isIrrigating && Array.from({ length: 15 }).map((_, i) => (
                <div 
                    key={i} 
                    className="bubble"
                    style={{
                        left: `${Math.random() * 90 + 5}%`,
                        animationDuration: `${Math.random() * 2 + 3}s`,
                        animationDelay: `${Math.random() * 3}s`,
                        transform: `scale(${Math.random() * 0.8 + 0.5})`
                    }}
                ></div>
            ))}
            <div className="flex items-center justify-between w-full mb-2">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('soilMoisture')}</h3>
                <DropletIcon className={`w-5 h-5 ${isSaturated ? 'text-red-500' : 'text-blue-500'}`} />
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                        className="text-slate-200 dark:text-slate-700"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        r="55"
                        cx="60"
                        cy="60"
                    />
                    <circle
                        className={isSaturated ? 'text-red-500' : 'text-blue-500'}
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r="55"
                        cx="60"
                        cy="60"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease'
                        }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <p className={`text-3xl font-bold ${isSaturated ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                        {Math.round(moisture)}
                        <span className="text-lg">%</span>
                    </p>
                    {isDraining && <span className="text-xs text-red-500 animate-pulse">{t('drainingExcess')}</span>}
                </div>
            </div>
             <div className="flex items-center gap-2 mt-3 w-full">
                <button
                    onClick={() => setIsIrrigating(!isIrrigating)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={moisture >= 100 || isDraining || (weather === 'rainy')}
                >
                    {isIrrigating ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    {isIrrigating ? t('stopIrrigation') : t('startIrrigation')}
                </button>
                 <button
                    onClick={() => setIsDraining(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={moisture < 90 || isDraining || isIrrigating}
                >
                    <DrainIcon className="w-5 h-5" />
                    {t('drainWater')}
                </button>
            </div>
        </div>
    );
};

export default SoilMoistureWidget;