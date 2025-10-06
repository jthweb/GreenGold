// FIX: This file was created to provide a weather display widget.
import React from 'react';
import { SunIcon, CloudIcon, CloudRainIcon } from './components/Icons';
import { useLocalization } from './hooks/useLocalization';
import { WeatherCondition } from './types';

interface WeatherWidgetProps {
    weather: WeatherCondition;
    setWeather: (value: WeatherCondition) => void;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, setWeather }) => {
    const { t } = useLocalization();

    const weatherData = {
        sunny: { icon: SunIcon, text: t('sunny'), temp: '32°C', humidity: '45%', wind: '12 km/h', color: 'text-amber-500' },
        cloudy: { icon: CloudIcon, text: t('cloudy'), temp: '28°C', humidity: '60%', wind: '15 km/h', color: 'text-slate-500' },
        rainy: { icon: CloudRainIcon, text: t('rainy'), temp: '25°C', humidity: '85%', wind: '20 km/h', color: 'text-blue-500' },
    };

    const currentWeatherData = weatherData[weather];

    return (
        <div className="bg-white dark:bg-[#202a25] p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('weather')}</h3>
                <select 
                    value={weather} 
                    onChange={(e) => setWeather(e.target.value as WeatherCondition)}
                    className="text-xs bg-transparent dark:bg-[#202a25] p-1 rounded-md border-none focus:ring-0"
                >
                    <option value="sunny">{t('sunny')}</option>
                    <option value="cloudy">{t('cloudy')}</option>
                    <option value="rainy">{t('rainy')}</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <currentWeatherData.icon className={`w-12 h-12 ${currentWeatherData.color}`} />
                <div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{currentWeatherData.temp}</p>
                    <p className={`text-sm font-semibold ${currentWeatherData.color}`}>{currentWeatherData.text}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-xs">
                <div className="text-slate-500 dark:text-slate-400">{t('humidity')}: <span className="font-semibold text-slate-700 dark:text-slate-200">{currentWeatherData.humidity}</span></div>
                <div className="text-slate-500 dark:text-slate-400">{t('wind')}: <span className="font-semibold text-slate-700 dark:text-slate-200">{currentWeatherData.wind}</span></div>
            </div>
        </div>
    );
};

export default WeatherWidget;