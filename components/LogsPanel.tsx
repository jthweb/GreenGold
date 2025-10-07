import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { NPKValues, WeatherCondition } from '../types';
import { ChevronLeftIcon } from './Icons';
import { useUser } from '../hooks/useUser';

interface FarmState {
    moisture: number;
    weather: WeatherCondition;
    phValue: number;
    npkValues: NPKValues;
    salinity: number;
}

interface LogEntry extends FarmState {
    timestamp: string;
    notes: string;
}

interface LogsPanelProps {
    onBack: () => void;
    farmState: FarmState;
}

const LogsPanel: React.FC<LogsPanelProps> = ({ onBack, farmState }) => {
    const { t } = useLocalization();
    const { user } = useUser();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [notes, setNotes] = useState('');
    const [isExiting, setIsExiting] = useState(false);

    const getLogsKey = () => `greengold_logs_${user?.email}`;

    useEffect(() => {
        if (!user) return;
        const savedLogs = JSON.parse(localStorage.getItem(getLogsKey()) || '[]');
        if (savedLogs.length === 0) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const autoLog: LogEntry = {
                ...farmState,
                moisture: 65,
                timestamp: yesterday.toISOString(),
                notes: "Auto-logged daily state."
            };
            savedLogs.unshift(autoLog);
            localStorage.setItem(getLogsKey(), JSON.stringify(savedLogs));
        }
        setLogs(savedLogs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleBack = () => {
        setIsExiting(true);
        setTimeout(onBack, 300); // Match animation duration
    };

    const handleSaveLog = () => {
        if (!user) return;
        const newLog: LogEntry = {
            ...farmState,
            timestamp: new Date().toISOString(),
            notes: notes,
        };
        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        localStorage.setItem(getLogsKey(), JSON.stringify(updatedLogs));
        setIsCreating(false);
        setNotes('');
    };

    const renderLogData = (log: FarmState) => (
         <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            <span>{t('soilMoisture')}: <strong>{log.moisture.toFixed(1)}%</strong></span>
            <span>{t('weather')}: <strong>{t(log.weather)}</strong></span>
            <span>{t('soilPH')}: <strong>{log.phValue.toFixed(1)}</strong></span>
            <span>{t('salinityEC')}: <strong>{log.salinity.toFixed(1)} dS/m</strong></span>
            <span className="col-span-2">NPK: <strong>{log.npkValues.n}/{log.npkValues.p}/{log.npkValues.k}</strong></span>
        </div>
    );

    return (
        <div className={`absolute inset-0 bg-slate-100 dark:bg-[#141615] z-50 flex flex-col ${isExiting ? 'animate-view-slide-out' : 'animate-view-slide-in'}`}>
            <header className="flex-shrink-0 bg-white/80 dark:bg-[#202a25]/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 h-16 flex items-center px-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-[#4A5C50] dark:text-slate-200 mx-auto">{t('farmLogs')}</h2>
                <div className="w-10"></div> {/* Spacer */}
            </header>
            
            <div className="flex-1 overflow-y-auto">
                 {isCreating ? (
                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold text-lg">{t('newLog')}</h3>
                        {renderLogData(farmState)}
                        <div className="mt-4">
                            <label className="text-sm font-medium">{t('notes')}</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={t('notesPlaceholder')}
                                rows={3}
                                className="mt-1 w-full p-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A221E] focus:ring-2 focus:ring-[#D4A22E] outline-none"
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                             <button onClick={() => setIsCreating(false)} className="w-full py-2 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold transition-colors hover:bg-slate-300 dark:hover:bg-slate-600">{t('cancel')}</button>
                             <button onClick={handleSaveLog} className="w-full py-2 rounded-lg bg-[#D4A22E] text-white font-semibold transition-opacity hover:opacity-90">{t('saveLog')}</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4">
                            <button onClick={() => setIsCreating(true)} className="w-full py-2.5 rounded-lg bg-[#D4A22E] text-white font-bold transition hover:opacity-90">{t('createNewLog')}</button>
                        </div>
                        <div className="p-4 pt-0 space-y-3">
                            {logs.length > 0 ? logs.map(log => (
                                <div key={log.timestamp} className="p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                    <p className="text-sm font-semibold">{new Date(log.timestamp).toLocaleString()}</p>
                                    {log.notes && <p className="text-sm my-2 italic text-slate-700 dark:text-slate-300">"{log.notes}"</p>}
                                    {renderLogData(log)}
                                </div>
                            )) : <p className="text-center text-slate-500 py-8">{t('noLogs')}</p>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LogsPanel;
