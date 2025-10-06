import React, { useState, useEffect, useRef } from 'react';
import { PHIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';

interface PHWidgetProps {
    phValue: number;
    setPhValue: React.Dispatch<React.SetStateAction<number>>;
    idealRange?: { min: number; max: number };
}

const PHWidget: React.FC<PHWidgetProps> = ({ phValue, setPhValue, idealRange }) => {
    const { t } = useLocalization();
    const [isAdjusting, setIsAdjusting] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const minIdeal = idealRange?.min ?? 6.5;
    const maxIdeal = idealRange?.max ?? 7.0;

    const getStatus = (ph: number) => {
        if (ph < minIdeal) return { text: t('acidic'), color: 'text-orange-500' };
        if (ph <= maxIdeal) return { text: t('ideal'), color: 'text-green-500' };
        return { text: t('alkaline'), color: 'text-purple-500' };
    };

    const adjustPh = (direction: 'acidic' | 'basic') => {
        if (isAdjusting) return;
        setIsAdjusting(true);

        const target = direction === 'acidic' ? maxIdeal - 0.1 : minIdeal + 0.1;

        intervalRef.current = window.setInterval(() => {
            setPhValue(prev => {
                const step = 0.05;
                let nextVal;

                if (direction === 'acidic') {
                    nextVal = Math.max(target, prev - step);
                } else { // basic
                    nextVal = Math.min(target, prev + step);
                }
                
                if ((direction === 'acidic' && nextVal <= target) || (direction === 'basic' && nextVal >= target)) {
                    if(intervalRef.current) clearInterval(intervalRef.current);
                    setIsAdjusting(false);
                    return parseFloat(target.toFixed(2));
                }
                
                return parseFloat(nextVal.toFixed(2));
            });
        }, 100);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const status = getStatus(phValue);
    const isAcidicDisabled = phValue <= minIdeal;
    const isBasicDisabled = phValue >= maxIdeal;

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('soilPH')}</h3>
                    <PHIcon className={`w-5 h-5 ${status.color}`} />
                </div>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2 transition-colors duration-300">{phValue.toFixed(1)}</p>
            </div>
            <p className={`text-xs font-semibold mt-1 ${status.color}`}>{status.text}</p>
            <div className="flex items-center gap-2 mt-3">
                 <button 
                    onClick={() => adjustPh('acidic')} 
                    disabled={isAdjusting || isAcidicDisabled}
                    className="w-full text-xs font-semibold py-1.5 px-2 rounded-md bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {t('makeAcidic')}
                </button>
                <button 
                    onClick={() => adjustPh('basic')}
                    disabled={isAdjusting || isBasicDisabled}
                    className="w-full text-xs font-semibold py-1.5 px-2 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {t('makeBasic')}
                </button>
            </div>
        </div>
    );
};

export default PHWidget;