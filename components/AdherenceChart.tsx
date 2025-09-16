
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import type { AdherenceDataPoint } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface AdherenceChartProps {
  data: AdherenceDataPoint[];
}

const AdherenceChart: React.FC<AdherenceChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-6 h-6 text-teal-500" />
        <h3 className="text-xl font-bold text-slate-800">Weekly Adherence</h3>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" tick={{ fill: '#64748b' }} />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              formatter={(value: number, name: string) => {
                  const percentage = (data.find(d => d.day === (name as any))?.taken / data.find(d => d.day === (name as any))?.total) * 100;
                  const adherence = (value / 100) * data.find(d => d.day === (name as any))?.total;
                  return [`${value.toFixed(0)}%`, `Adherence`];
              }}
            />
            <Legend wrapperStyle={{ color: '#334155' }} />
            <Bar
              dataKey={(d) => (d.taken / d.total) * 100}
              name="Adherence"
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdherenceChart;
