import { NPKValues, WeatherCondition } from '../types';

interface FarmData {
    moisture: number;
    weather: WeatherCondition;
    phValue: number;
    npkValues: NPKValues;
    salinity: number;
}

export const farmData: FarmData = {
    moisture: 45,
    weather: 'sunny',
    phValue: 7.2,
    npkValues: {
        n: 18,
        p: 8,
        k: 15
    },
    salinity: 1.8
};
