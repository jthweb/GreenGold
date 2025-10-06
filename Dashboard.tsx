

// FIX: This file was created to display the main dashboard grid.
import React from 'react';
// FIX: Adjusted import paths to point to the components directory.
import WidgetWrapper from './components/WidgetWrapper';
import WeatherWidget from './WeatherWidget';
import SoilMoistureWidget from './components/SoilMoistureWidget';
import CropDistributionWidget from './components/CropDistributionWidget';
import MarketAnalysisWidget from './components/MarketAnalysisWidget';
import AlertsWidget from './components/AlertsWidget';
import RecommendationsWidget from './RecommendationsWidget';
import ImpactWidget from './components/ImpactWidget';
import SalinityWidget from './components/SalinityWidget';
import PHWidget from './components/PHWidget';
import NPKWidget from './components/NPKWidget';
// FIX: Adjusted import paths for types and hooks to work from the root directory.
import { WeatherCondition, NPKValues } from './types';
import TimeOfDayWidget from './TimeOfDayWidget';
import IrrigationAdvisorWidget from './components/IrrigationAdvisorWidget';
import { useLocalization } from './hooks/useLocalization';

interface DashboardProps {
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
    // FIX: Added missing salinity props to the interface.
    salinity: number;
    setSalinity: React.Dispatch<React.SetStateAction<number>>;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const { t } = useLocalization();
    // FIX: Destructured the new salinity props.
    const { onExplain, moisture, setMoisture, isIrrigating, setIsIrrigating, isDraining, setIsDraining, weather, setWeather, phValue, setPhValue, npkValues, setNpkValues, salinity, setSalinity } = props;

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

    // Effect for draining excess water
    React.useEffect(() => {
        let drainInterval: number | null = null;
        if (moisture >= 110 && !isDraining) {
            setIsDraining(true);
        }

        if (isDraining) {
            drainInterval = window.setInterval(() => {
                setMoisture(prev => {
                    const newMoisture = prev - 0.25;
                    if (newMoisture <= 100) {
                        if (drainInterval) clearInterval(drainInterval);
                        setIsDraining(false);
                        return 100;
                    }
                    return newMoisture;
                });
            }, 150);
        }
        return () => {
            if (drainInterval) clearInterval(drainInterval);
        };
    }, [moisture, isDraining, setIsDraining, setMoisture]);
    
    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-[#141615]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Column 1 */}
                <div className="space-y-6">
                    <WidgetWrapper title={t('farmerName')} explanation={t('timeOfDayExplain')} explanationPrompt={t('timeOfDayExplainPrompt')} onExplain={onExplain}><TimeOfDayWidget /></WidgetWrapper>
                    <WidgetWrapper title={t('weather')} explanation={t('weatherExplain')} explanationPrompt={t('weatherExplainPrompt')} onExplain={onExplain}><WeatherWidget weather={weather} setWeather={setWeather} /></WidgetWrapper>
                    <WidgetWrapper title={t('alerts')} explanation={t('alertsExplain')} explanationPrompt={t('alertsExplainPrompt')} onExplain={onExplain}><AlertsWidget /></WidgetWrapper>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                   <WidgetWrapper title={t('soilMoisture')} explanation={t('soilMoistureExplain')} explanationPrompt={t('soilMoistureExplainPrompt')} onExplain={onExplain}>
                        <SoilMoistureWidget 
                            moisture={moisture} 
                            isIrrigating={isIrrigating} 
                            isDraining={isDraining}
                            setMoisture={setMoisture} 
                            setIsIrrigating={setIsIrrigating} 
                            // FIX: Passed the required setIsDraining prop.
                            setIsDraining={setIsDraining}
                            weather={weather} 
                        />
                   </WidgetWrapper>
                   {/* FIX: Passed the required salinity props to SalinityWidget. */}
                   <WidgetWrapper title={t('salinityEC')} explanation={t('salinityExplain')} explanationPrompt={t('salinityExplainPrompt')} onExplain={onExplain}><SalinityWidget salinity={salinity} setSalinity={setSalinity} /></WidgetWrapper>
                   <WidgetWrapper title={t('soilPH')} explanation={t('phExplain')} explanationPrompt={t('phExplainPrompt')} onExplain={onExplain}><PHWidget phValue={phValue} setPhValue={setPhValue} /></WidgetWrapper>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                    <WidgetWrapper title={t('topRecommendations')} explanation={t('recommendationsExplain')} explanationPrompt={t('recommendationsExplainPrompt')} onExplain={onExplain}><RecommendationsWidget /></WidgetWrapper>
                    <WidgetWrapper title={t('npkLevels')} explanation={t('npkExplain')} explanationPrompt={t('npkExplainPrompt')} onExplain={onExplain}><NPKWidget npkValues={npkValues} setNpkValues={setNpkValues} /></WidgetWrapper>
                    <WidgetWrapper title={t('yourImpact')} explanation={t('impactExplain')} explanationPrompt={t('impactExplainPrompt')} onExplain={onExplain}><ImpactWidget /></WidgetWrapper>
                </div>
                
                {/* Column 4 */}
                <div className="space-y-6">
                    {/* FIX: Passed the required phValue prop. */}
                    <IrrigationAdvisorWidget onExplain={onExplain} isIrrigating={isIrrigating} moisture={moisture} weather={weather} phValue={phValue} />
                    <WidgetWrapper title={t('cropDistribution')} explanation={t('cropDistributionExplain')} explanationPrompt={t('cropDistributionExplainPrompt')} onExplain={onExplain}><CropDistributionWidget /></WidgetWrapper>
                    <WidgetWrapper title={t('marketAnalysis')} explanation={t('marketAnalysisExplain')} explanationPrompt={t('marketAnalysisExplainPrompt')} onExplain={onExplain}><MarketAnalysisWidget /></WidgetWrapper>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;