// FIX: This file was created to provide a smart irrigation advisor widget.
import React from 'react';
import WidgetWrapper from './WidgetWrapper';
import { SmartIrrigationIcon, PHIcon, SunIcon, ArrowTrendingUpIcon } from './Icons';
import { useLocalization } from '../hooks/useLocalization';
import { WeatherCondition } from '../types';

interface IrrigationAdvisorWidgetProps {
    onExplain: (prompt: string) => void;
    isIrrigating: boolean;
    moisture: number;
    weather: WeatherCondition;
    phValue: number;
}

const AdviceContext: React.FC<{icon: React.FC<{className?: string}>, text: string, color: string}> = ({ icon: Icon, text, color }) => (
    <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
        <p className="text-xs text-slate-500 dark:text-slate-400">{text}</p>
    </div>
);

const IrrigationAdvisorWidget: React.FC<IrrigationAdvisorWidgetProps> = ({ onExplain, isIrrigating, moisture, weather, phValue }) => {
    const { t } = useLocalization();

    const getAdvice = () => {
        const phStatus = phValue < 6.5 ? t('acidic') : phValue > 7.0 ? t('alkaline') : t('ideal');

        const factors = [
            { icon: SunIcon, text: t('advisorContextWeather', { weather: t(weather) }), color: 'text-slate-500' },
            { icon: PHIcon, text: t('advisorContextPH', { status: phStatus, value: phValue.toFixed(1) }), color: phStatus === t('ideal') ? 'text-green-500' : 'text-amber-500' },
            { icon: ArrowTrendingUpIcon, text: t('advisorContextMarket'), color: 'text-green-500' },
            { icon: SmartIrrigationIcon, text: t('advisorContextImpact'), color: 'text-blue-500' },
        ];

        if (isIrrigating) {
            return {
                title: t('irrigationInProgress'),
                text: t('irrigationInProgressDesc'),
                color: 'text-blue-500',
                iconColor: 'text-blue-500',
                factors
            };
        }
        if (weather === 'rainy') {
            return {
                title: t('rainExpected'),
                text: t('rainExpectedDesc'),
                color: 'text-slate-500',
                iconColor: 'text-slate-500',
                factors
            };
        }
        if (moisture < 40) {
            return {
                title: t('immediateAction'),
                text: t('immediateActionDesc'),
                color: 'text-red-500',
                iconColor: 'text-red-500',
                factors
            };
        }
        if (moisture < 60) {
            return {
                title: t('considerIrrigation'),
                text: t('considerIrrigationDesc'),
                color: 'text-amber-500',
                iconColor: 'text-amber-500',
                factors
            };
        }
        return {
            title: t('moistureOptimal'),
            text: t('moistureOptimalDesc'),
            color: 'text-green-500',
            iconColor: 'text-green-500',
            factors
        };
    };

    const advice = getAdvice();

    return (
        <WidgetWrapper
            title={t('irrigationAdvisor')}
            explanation={t('irrigationAdvisorExplain')}
            explanationPrompt={t('irrigationAdvisorExplainPrompt')}
            onExplain={onExplain}
        >
            <div className="flex flex-col text-center h-full">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <SmartIrrigationIcon className={`w-10 h-10 mb-2 ${advice.iconColor}`} />
                    <h4 className={`text-base font-bold ${advice.color}`}>{advice.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{advice.text}</p>
                </div>
                 <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-300 text-start mb-2">{t('advisorContextTitle')}</h5>
                    {advice.factors.map((factor, index) => (
                        <AdviceContext key={index} icon={factor.icon} text={factor.text} color={factor.color} />
                    ))}
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default IrrigationAdvisorWidget;