// FIX: This file was created to provide a time of day and greeting widget.
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, LeafIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

const TimeOfDayWidget: React.FC = () => {
    const { t } = useLocalization();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    const isDay = hours >= 6 && hours < 18;
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getGreeting = () => {
        if (!isDay) return t('goodNight');
        if (hours < 12) return t('goodMorning');
        if (hours < 18) return t('goodAfternoon');
        return t('goodEvening');
    };
    
    const Icon = isDay ? SunIcon : MoonIcon;
    const gradient = isDay 
        ? 'from-sky-400 to-amber-300' 
        : 'from-indigo-900 to-slate-800';
    const textColor = isDay ? 'text-white' : 'text-slate-200';

    return (
        <div className={`relative p-6 rounded-xl shadow-sm flex flex-col justify-between text-white overflow-hidden bg-gradient-to-br ${gradient}`}>
             <div className="absolute -top-4 -end-4">
                <Icon className={`w-24 h-24 opacity-20 ${textColor}`} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2">
                    <LeafIcon className="w-5 h-5" />
                    <p className="font-semibold">{t('farmerName')}</p>
                </div>
                <h2 className="text-2xl font-bold mt-1">{getGreeting()}</h2>
            </div>
            <div className="relative z-10 mt-6">
                <p className="text-4xl font-bold tracking-tighter">{timeString}</p>
                <p className="text-sm opacity-80">{time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
    );
};

export default TimeOfDayWidget;