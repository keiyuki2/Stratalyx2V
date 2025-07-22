
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PerformanceData } from '../types';

interface PerformanceChartProps {
    data: PerformanceData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface p-4 border border-border rounded-lg shadow-lg">
                <p className="label font-bold text-text-primary">{`${label}`}</p>
                {payload.map((pld: any) => (
                    <div key={pld.dataKey} style={{ color: pld.color }}>
                        {pld.dataKey}: {pld.value}%
                    </div>
                ))}
            </div>
        );
    }
    return null;
};


const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="date" stroke="#848D97" />
                <YAxis stroke="#848D97" domain={[75, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Legend />
                <Line type="monotone" dataKey="OpenAI" stroke="#34D399" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Claude" stroke="#2F81F7" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Gemini" stroke="#FBBF24" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PerformanceChart;
