import React from 'react';

interface DoughnutChartProps {
    data: { label: string; value: number; color: string }[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    const segments = data.map(item => {
        const percentage = (item.value / total) * 100;
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        
        const largeArcFlag = percentage > 50 ? 1 : 0;
        
        const startX = 50 + 40 * Math.cos(Math.PI * (startAngle - 90) / 180);
        const startY = 50 + 40 * Math.sin(Math.PI * (startAngle - 90) / 180);
        const endX = 50 + 40 * Math.cos(Math.PI * (endAngle - 90) / 180);
        const endY = 50 + 40 * Math.sin(Math.PI * (endAngle - 90) / 180);

        // This ensures the arc is drawn for a full circle
        if (endAngle - startAngle === 360) {
            const startX_close = 50 + 40 * Math.cos(Math.PI * (endAngle - 90 - 0.01) / 180);
            const startY_close = 50 + 40 * Math.sin(Math.PI * (endAngle - 90 - 0.01) / 180);
            const pathData = `M ${startX},${startY} A 40,40 0 ${largeArcFlag},1 ${startX_close},${startY_close}`;
            return <path key={item.label} d={pathData} stroke={item.color} strokeWidth="15" fill="none" />;
        }
        
        const pathData = `M ${startX},${startY} A 40,40 0 ${largeArcFlag},1 ${endX},${endY}`;
        
        return <path key={item.label} d={pathData} stroke={item.color} strokeWidth="15" fill="none" />;
    });

    return (
        <svg viewBox="0 0 100 100" className="w-20 h-20 transform -rotate-90">
            {segments}
        </svg>
    );
};

export default DoughnutChart;
