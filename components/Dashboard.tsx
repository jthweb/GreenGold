import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { NPKValues, WeatherCondition } from '../types';

import TimeOfDayWidget from './TimeOfDayWidget';
import WeatherWidget from './WeatherWidget';
import SoilMoistureWidget from './SoilMoistureWidget';
import NPKWidget from './NPKWidget';
import PHWidget from './PHWidget';
import SalinityWidget from './SalinityWidget';
import CropDistributionWidget from './CropDistributionWidget';
import MarketAnalysisWidget from './MarketAnalysisWidget';
import ImpactWidget from './ImpactWidget';
import AlertsWidget from './AlertsWidget';
import RecommendationsWidget from './RecommendationsWidget';
import ActionsWidget from './ActionsWidget';
import IrrigationAdvisorWidget from './IrrigationAdvisorWidget';
import WidgetWrapper from './WidgetWrapper';
import { useUser } from '../hooks/useUser';

interface FarmState {
    moisture: number;
    weather: WeatherCondition;
    phValue: number;
    npkValues: NPKValues;
    salinity: number;
}

interface DashboardProps {
    onExplain: (prompt: string) => void;
    farmState: FarmState;
    setFarmState: {
        setMoisture: React.Dispatch<React.SetStateAction<number>>;
        setWeather: React.Dispatch<React.SetStateAction<WeatherCondition>>;
        setPhValue: React.Dispatch<React.SetStateAction<number>>;
        setNpkValues: React.Dispatch<React.SetStateAction<NPKValues>>;
        setSalinity: React.Dispatch<React.SetStateAction<number>>;
    }
}

const Dashboard: React.FC<DashboardProps> = ({ onExplain, farmState, setFarmState }) => {
    const { t } = useLocalization();
    const { user } = useUser();

    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <TimeOfDayWidget user={user} />
                </div>
                <div>
                     <WeatherWidget weather={farmState.weather} setWeather={setFarmState.setWeather} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <WidgetWrapper title={t('soilMoisture')} explanation={t('soilMoistureExplain')} explanationPrompt={t('soilMoisturePrompt')} onExplain={onExplain}>
                    <SoilMoistureWidget moisture={farmState.moisture} setMoisture={setFarmState.setMoisture} />
                </WidgetWrapper>
                <WidgetWrapper title="NPK" explanation={t('npkExplain')} explanationPrompt={t('npkPrompt')} onExplain={onExplain}>
                    <NPKWidget npkValues={farmState.npkValues} setNpkValues={setFarmState.setNpkValues}/>
                </WidgetWrapper>
                <WidgetWrapper title={t('soilPH')} explanation={t('phExplain')} explanationPrompt={t('phPrompt')} onExplain={onExplain}>
                    <PHWidget phValue={farmState.phValue} setPhValue={setFarmState.setPhValue} />
                </WidgetWrapper>
                <WidgetWrapper title={t('salinityEC')} explanation={t('salinityExplain')} explanationPrompt={t('salinityPrompt')} onExplain={onExplain}>
                    <SalinityWidget salinity={farmState.salinity} setSalinity={setFarmState.setSalinity} />
                </WidgetWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <WidgetWrapper title={t('irrigationAdvisor')} explanation={t('irrigationAdvisorExplain')} explanationPrompt={t('irrigationAdvisorPrompt')} onExplain={onExplain}>
                        <IrrigationAdvisorWidget moisture={farmState.moisture} weather={farmState.weather} onExplain={onExplain} />
                    </WidgetWrapper>
                    <WidgetWrapper title={t('topRecommendations')} explanation={t('recommendationsExplain')} explanationPrompt={t('recommendationsPrompt')} onExplain={onExplain}>
                        <RecommendationsWidget />
                    </WidgetWrapper>
                    <WidgetWrapper title={t('alerts')} explanation={t('alertsExplain')} explanationPrompt={t('alertsPrompt')} onExplain={onExplain}>
                        <AlertsWidget />
                    </WidgetWrapper>
                     <WidgetWrapper title={t('quickActions')} explanation={t('actionsExplain')} explanationPrompt={t('actionsPrompt')} onExplain={onExplain}>
                        <ActionsWidget onExplain={onExplain} />
                    </WidgetWrapper>
                </div>
                 <div className="space-y-4">
                    <WidgetWrapper title={t('cropDistribution')} explanation={t('cropDistributionExplain')} explanationPrompt={t('cropDistributionPrompt')} onExplain={onExplain}>
                        <CropDistributionWidget />
                    </WidgetWrapper>
                    <WidgetWrapper title={t('marketAnalysis')} explanation={t('marketAnalysisExplain')} explanationPrompt={t('marketAnalysisPrompt')} onExplain={onExplain}>
                       <MarketAnalysisWidget />
                    </WidgetWrapper>
                    <WidgetWrapper title={t('yourImpact')} explanation={t('impactExplain')} explanationPrompt={t('impactPrompt')} onExplain={onExplain}>
                        <ImpactWidget />
                    </WidgetWrapper>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
