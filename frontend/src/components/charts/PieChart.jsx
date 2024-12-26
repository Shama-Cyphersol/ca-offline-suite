import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const CustomPieChart = ({ 
  data, 
  valueKey = 'value',
  nameKey = 'name',
  colors = [
    '#10B981', // green
    '#F59E0B', // yellow
    '#EC4899', // pink
    '#8B5CF6', // purple
    '#6366F1', // indigo
    '#D946EF', // fuchsia
    '#8B0000', // dark red
    '#EF4444', // red
    '#F97316', // orange
    '#22C55E', // emerald
    '#F08080', // light coral
    '#DC143C', // crimson
    '#FFFFE0', // light yellow
    '#FFD700'  // gold
  ],
  height = 600,
  currency = '₹',
  showLegend = true,
//   legendPosition = 'right'
}) => {
  // Format number to Indian currency format
  const formatToInr = (value) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-600">
            {currency}{formatToInr(payload[0].value)}
          </p>
          <p className="text-gray-500">
            {((payload[0].value / total) * 100).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);

  // Custom legend that shows percentages
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value} ({((entry.payload[valueKey] / total) * 100).toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="0%"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              content={<CustomLegend />}
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{
                paddingLeft: '20px'
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;