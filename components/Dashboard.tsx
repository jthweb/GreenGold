// FIX: This file was created to display the main dashboard grid.
import React from 'react';
import WidgetWrapper from './WidgetWrapper';
import WeatherWidget from './WeatherWidget';
import SoilMoistureWidget from './SoilMoistureWidget';
import CropDistributionWidget from './CropDistributionWidget';
import MarketAnalysisWidget from './MarketAnalysisWidget';
import AlertsWidget from './AlertsWidget';
import RecommendationsWidget from './RecommendationsWidget';
import ImpactWidget from './ImpactWidget';
import SalinityWidget from './SalinityWidget';
import PHWidget from './PHWidget';
import NPKWidget from './NPKWidget';
import { WeatherCondition, NPKValues, User, IdealConditions } from '../types';
import TimeOfDayWidget from './TimeOfDayWidget';
import IrrigationAdvisorWidget from './IrrigationAdvisorWidget';
import { useLocalization } from '../hooks/useLocalization';
import ActionsWidget from './ActionsWidget';

interface DashboardProps {
    user: User | null;
    idealConditions?: IdealConditions;
    onExplain: (prompt: string) => void;
    moisture: number;
    setMoisture: React.Dispatch<React.SetStateAction<number>>;
    isIrrigating: boolean;
    setIsIrrigating: React.Dispatch<React.SetStateAction<boolean>>;
    isDraining: boolean;
    setIsDraining: React.Dispatch<React.SetStateAction<boolean>>;
    weather: WeatherCondition;
    setWeather: React.Dispatch<React.SetStateAction<WeatherCondition>>;
    phValue: number;
    setPhValue: React.Dispatch<React.SetStateAction<number>>;
    npkValues: NPKValues;
    setNpkValues: React.Dispatch<React.SetStateAction<NPKValues>>;
    salinity: number;
    setSalinity: React.Dispatch<React.SetStateAction<number>>;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const { t } = useLocalization();
    const { user, idealConditions, onExplain, moisture, setMoisture, isIrrigating, setIsIrrigating, isDraining, setIsDraining, weather, setWeather, phValue, setPhValue, npkValues, setNpkValues, salinity, setSalinity } = props;

    // Effect for rain simulation
    React.useEffect(() => {
        let rainInterval: number | null = null;
        if (weather === 'rainy' && !isIrrigating && !isDraining) {
            rainInterval = window.setInterval(() => {
                setMoisture(prev => {
                    const newMoisture = prev + 0.2;
                    if (newMoisture >= 110) {
                        if (rainInterval) clearInterval(rainInterval);
                        return 110;
                    }
                    return newMoisture;
                });
            }, 200);
        }
        return () => {
            if (rainInterval) clearInterval(rainInterval);
        };
    }, [weather, isIrrigating, isDraining, setMoisture]);

    // BUG FIX: Corrected draining logic to reliably decrease moisture.
    React.useEffect(() => {
        let drainInterval: number | null = null;
        if (isDraining) {
            drainInterval = window.setInterval(() => {
                setMoisture(prev => {
                    const newMoisture = prev - 0.5; // Increased drain rate
                    if (newMoisture <= 30) { 
                        if (drainInterval) clearInterval(drainInterval);
                        setIsDraining(false);
                        return 30;
                    }
                    return newMoisture;
                });
            }, 100);
        }
        return () => {
            if (drainInterval) clearInterval(drainInterval);
        };
    }, [isDraining, setIsDraining, setMoisture]);

     // Effect for evaporation/water usage simulation
    React.useEffect(() => {
        const evaporationInterval = setInterval(() => {
            if (isIrrigating || isDraining || weather === 'rainy') return;

            let rate = 0.05; // Base rate
            if (weather === 'sunny') rate = 0.1;
            if (weather === 'cloudy') rate = 0.05;

            setMoisture(prev => Math.max(0, prev - rate));

        }, 3000); // every 3 seconds

        return () => clearInterval(evaporationInterval);
    }, [isIrrigating, isDraining, weather, setMoisture]);
    
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-6">
                
                <div className="md:col-span-2 lg:col-span-4 opacity-0 animate-slide-in-up" style={{ animationDelay: '100ms'}}>
                    <WidgetWrapper title="" explanation="" explanationPrompt="" onExplain={() => {}} hasNoHeader>
                        <TimeOfDayWidget user={user} />
                    </WidgetWrapper>
                </div>
                
                <div className="md:col-span-2 lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '200ms'}}>
                     <WidgetWrapper title={t('weather')} explanation={t('weatherExplain')} explanationPrompt={t('weatherExplainPrompt')} onExplain={onExplain}><WeatherWidget weather={weather} setWeather={setWeather} /></WidgetWrapper>
                </div>
                
                <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '300ms'}}>
                    <IrrigationAdvisorWidget idealRange={idealConditions?.moisture} onExplain={onExplain} isIrrigating={isIrrigating} moisture={moisture} weather={weather} phValue={phValue} />
                </div>

                <div className="md:col-span-2 lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '400ms'}}>
                     <WidgetWrapper title={t('soilMoisture')} explanation={t('soilMoistureExplain')} explanationPrompt={t('soilMoistureExplainPrompt')} onExplain={onExplain}>
                        <SoilMoistureWidget 
                            moisture={moisture} 
                            idealRange={idealConditions?.moisture}
                            isIrrigating={isIrrigating} 
                            isDraining={isDraining}
                            setMoisture={setMoisture} 
                            setIsIrrigating={setIsIrrigating} 
                            setIsDraining={setIsDraining}
                            weather={weather} 
                        />
                   </WidgetWrapper>
                </div>

                 <div className="lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '500ms'}}>
                    <WidgetWrapper title={t('npkLevels')} explanation={t('npkExplain')} explanationPrompt={t('npkExplainPrompt')} onExplain={onExplain}><NPKWidget npkValues={npkValues} setNpkValues={setNpkValues} /></WidgetWrapper>
                </div>

                <div className="lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '600ms'}}>
                    <WidgetWrapper title={t('topRecommendations')} explanation={t('recommendationsExplain')} explanationPrompt={t('recommendationsExplainPrompt')} onExplain={onExplain}><RecommendationsWidget /></WidgetWrapper>
                </div>

                <div className="lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '700ms'}}>
                     <WidgetWrapper title={t('alerts')} explanation={t('alertsExplain')} explanationPrompt={t('alertsExplainPrompt')} onExplain={onExplain}><AlertsWidget /></WidgetWrapper>
                </div>

                <div className="opacity-0 animate-slide-in-up" style={{ animationDelay: '800ms'}}>
                    <WidgetWrapper title={t('soilPH')} explanation={t('phExplain')} explanationPrompt={t('phExplainPrompt')} onExplain={onExplain}><PHWidget phValue={phValue} setPhValue={setPhValue} idealRange={idealConditions?.ph} /></WidgetWrapper>
                </div>
                
                <div className="opacity-0 animate-slide-in-up" style={{ animationDelay: '900ms'}}>
                    <WidgetWrapper title={t('salinityEC')} explanation={t('salinityExplain')} explanationPrompt={t('salinityExplainPrompt')} onExplain={onExplain}><SalinityWidget salinity={salinity} setSalinity={setSalinity} /></WidgetWrapper>
                </div>
                
                <div className="lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '1000ms'}}>
                    <WidgetWrapper title={t('marketAnalysis')} explanation={t('marketAnalysisExplain')} explanationPrompt={t('marketAnalysisExplainPrompt')} onExplain={onExplain}><MarketAnalysisWidget crops={user?.primaryCrops || ""} /></WidgetWrapper>
                </div>

                <div className="opacity-0 animate-slide-in-up" style={{ animationDelay: '1100ms'}}>
                    <WidgetWrapper title={t('cropDistribution')} explanation={t('cropDistributionExplain')} explanationPrompt={t('cropDistributionExplainPrompt')} onExplain={onExplain}><CropDistributionWidget crops={user?.primaryCrops || ""} /></WidgetWrapper>
                </div>

                <div className="opacity-0 animate-slide-in-up" style={{ animationDelay: '1200ms'}}>
                    <WidgetWrapper title={t('yourImpact')} explanation={t('impactExplain')} explanationPrompt={t('impactExplainPrompt')} onExplain={onExplain}><ImpactWidget /></WidgetWrapper>
                </div>

                <div className="lg:col-span-2 opacity-0 animate-slide-in-up" style={{ animationDelay: '1300ms'}}>
                    <WidgetWrapper title={t('quickActions')} explanation={t('actionsExplain')} explanationPrompt={t('actionsExplainPrompt')} onExplain={onExplain}>
                        <ActionsWidget onExplain={onExplain} />
                    </WidgetWrapper>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;