import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
    data: { value: number }[];
    color: string;
    height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color, height = 40 }) => {
    if (!data || data.length === 0) {
        return <div style={{ height: `${height}px`, width: '100%' }} className="flex items-center justify-center text-xs text-text-secondary">No data</div>;
    }
    
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Sparkline;
