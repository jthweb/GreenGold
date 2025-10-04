import React from 'react';
import { VisualizationData } from '../types';
import { ChartBarIcon } from './Icons'; // Re-using icon for consistency

const COLORS = ['#D4A22E', '#FBBF24', '#4A5C50', '#8D9A92', '#FDE047', '#6B7280'];

const PieChart: React.FC<{ vizData: VisualizationData }> = ({ vizData }) => {
    const total = vizData.data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
      return (
         <div className="p-4 rounded-lg w-full max-w-md" style={{backgroundColor: 'rgba(74, 92, 80, 0.1)'}}>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">{vizData.title}</h3>
            <p className="text-slate-500 dark:text-slate-400">No data to display.</p>
        </div>
      )
    }
    let cumulative = 0;

    const segments = vizData.data.map((item, index) => {
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        
        // This ensures the arc is drawn for a full circle
        if (endAngle - startAngle === 360) {
            const pathData = `M 50,50 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0`;
            return <path key={item.label} d={pathData} fill={COLORS[index % COLORS.length]} />;
        }
        
        const largeArcFlag = ((endAngle - startAngle) > 180) ? 1 : 0;
        
        const startX = 50 + 50 * Math.cos(Math.PI * (startAngle - 90) / 180);
        const startY = 50 + 50 * Math.sin(Math.PI * (startAngle - 90) / 180);
        const endX = 50 + 50 * Math.cos(Math.PI * (endAngle - 90) / 180);
        const endY = 50 + 50 * Math.sin(Math.PI * (endAngle - 90) / 180);

        const pathData = `M 50,50 L ${startX},${startY} A 50,50 0 ${largeArcFlag},1 ${endX},${endY} Z`;
        
        return <path key={item.label} d={pathData} fill={COLORS[index % COLORS.length]} />;
    });

    return (
        <div className="p-4 rounded-lg w-full max-w-md" style={{backgroundColor: 'rgba(74, 92, 80, 0.1)'}}>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                 <ChartBarIcon className="w-5 h-5 text-[#4A5C50] dark:text-green-400" />
                {vizData.title}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
                    {segments}
                </svg>
                <div className="space-y-1 text-sm w-full">
                    {vizData.data.map((item, index) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-slate-700 dark:text-slate-200 truncate" title={item.label}>{item.label}</span>
                            <span className="ml-auto font-medium text-slate-500 dark:text-slate-400">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PieChart;
