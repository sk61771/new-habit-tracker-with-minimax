import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORIES, getCategoryById } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';

export default function CategoryChart({ data }) {
  const chartData = CATEGORIES.map(cat => ({
    name: cat.name.split(' ')[0],
    value: data[cat.id] || 0,
    color: cat.color,
    fullName: cat.name
  })).filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <span className="text-4xl">📈</span>
          </div>
          <p className="text-slate-400">No spending data</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-xl">
          <p className="font-medium text-white">{payload[0].payload.fullName}</p>
          <p className="text-indigo-400 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
          <XAxis
            type="number"
            tickFormatter={(value) => `€${value}`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
            animationDuration={1000}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
