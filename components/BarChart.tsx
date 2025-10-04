import React from 'react';
import { VisualizationData } from '../types';
import { ChartBarIcon } from './Icons';

interface BarChartProps {
    vizData: VisualizationData;
}

const BarChart: React.FC<BarChartProps> = ({ vizData }) => {
    const maxValue = Math.max(...vizData.data.map(item => item.value), 0);
    
    return (
        <div className="p-4 rounded-lg w-full max-w-md" style={{backgroundColor: 'rgba(74, 92, 80, 0.1)'}}>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-[#4A5C50] dark:text-green-400" />
                {vizData.title}
            </h3>
            <div className="space-y-3">
                {vizData.data.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 items-center text-sm">
                        <span className="truncate text-slate-600 dark:text-slate-300" title={item.label}>{item.label}</span>
                        <div className="col-span-2 bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                            <div
                                className="h-6 rounded-full flex items-center justify-end px-2"
                                style={{ 
                                    width: `${Math.max(10, (item.value / maxValue) * 100)}%`,
                                    backgroundColor: '#D4A22E'
                                 }} // min-width to show value
                            >
                                <span className="text-white font-bold text-xs drop-shadow">{item.value}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BarChart;