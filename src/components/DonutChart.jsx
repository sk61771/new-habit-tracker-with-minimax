import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORIES, getCategoryById } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';

export default function DonutChart({ data, total }) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([id, value]) => ({
      name: getCategoryById(id).name,
      value,
      color: getCategoryById(id).color
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <span className="text-4xl">📊</span>
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
          <p className="font-medium text-white">{payload[0].name}</p>
          <p className="text-indigo-400 font-bold">{formatCurrency(payload[0].value)}</p>
          <p className="text-slate-400 text-sm">
            {((payload[0].value / total) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center -mt-16 mb-4">
        <div className="text-center">
          <p className="text-slate-400 text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {CATEGORIES.filter(cat => data[cat.id] > 0).map((cat) => (
          <div key={cat.id} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs text-slate-400">{cat.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
