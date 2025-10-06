import React, { useEffect, useRef } from 'react';
import { DropletIcon, PlayIcon, StopIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';
import { WeatherCondition } from '../types';

interface SoilMoistureWidgetProps {
    moisture: number;
    idealRange?: { min: number; max: number };
    isIrrigating: boolean;
    isDraining: boolean;
    setMoisture: (value: React.SetStateAction<number>) => void;
    setIsIrrigating: (value: React.SetStateAction<boolean>) => void;
    setIsDraining: (value: React.SetStateAction<boolean>) => void;
    weather: WeatherCondition;
}

const SoilMoistureWidget: React.FC<SoilMoistureWidgetProps> = ({ moisture, idealRange, isIrrigating, isDraining, setMoisture, setIsIrrigating, setIsDraining, weather }) => {
    const { t } = useLocalization();
    const intervalRef = useRef<number | null>(null);
    const minIdeal = idealRange?.min ?? 60;
    const maxIdeal = idealRange?.max ?? 80;
    const isOptimal = moisture >= minIdeal && moisture <= maxIdeal;

    useEffect(() => {
        if (isIrrigating) {
            let seconds = 0;
            intervalRef.current = window.setInterval(() => {
                seconds++;
                const increment = seconds <= 5 ? 1 : 1 / 12;
                setMoisture(prev => Math.min(110, prev + increment));
            }, 500);

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
        if (moisture >= 110 && isIrrigating) {
            setIsIrrigating(false);
        }
    }, [moisture, isIrrigating, setIsIrrigating]);

    const circumference = 2 * Math.PI * 55; // r = 55
    const isSaturated = moisture > 100;
    const visualMoisture = Math.min(100, moisture);
    const strokeDashoffset = circumference - (visualMoisture / 100) * circumference;

    const getRingColor = () => {
        if (isSaturated) return 'text-red-500';
        if (!isOptimal) return 'text-amber-500';
        return 'text-blue-500';
    };

    return (
        <div className="bg-white dark:bg-[#202a25] p-4 rounded-xl shadow-sm flex flex-col justify-between items-center relative overflow-hidden h-full">
            {isIrrigating && (
                 <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                    <div className="relative w-full h-full">
                        <div className="irrigation-wave" style={{animationDelay: '0s'}}></div>
                        <div className="irrigation-wave" style={{animationDelay: '1s'}}></div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between w-full mb-2 z-10">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('soilMoisture')}</h3>
                <DropletIcon className={`w-5 h-5 ${getRingColor()} ${!isOptimal && !isSaturated ? 'animate-subtle-pulse' : ''}`} />
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center z-10">
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
                        className={getRingColor()}
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
             <div className="flex items-center gap-2 mt-3 w-full z-10">
                <button
                    onClick={() => setIsIrrigating(!isIrrigating)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={moisture >= 110 || isDraining || (weather === 'rainy')}
                >
                    {isIrrigating ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    {isIrrigating ? t('stopIrrigation') : t('startIrrigation')}
                </button>
                 <button
                    onClick={() => setIsDraining(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={moisture < 30 || isDraining || isIrrigating}
                >
                    {/* Re-using icon for simplicity, could be a new drain icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    {t('drainWater')}
                </button>
            </div>
        </div>
    );
};

export default SoilMoistureWidget;