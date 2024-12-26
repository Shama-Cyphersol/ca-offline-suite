import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LineBarChart = ({ 
  data = [], 
  barDataKey = 'debit',
  lineDataKey = 'balance',
  xAxisDataKey = 'date',
  height = 400,
  isLoading = false,
  barColor = '#3498db',
  lineColor = '#2ecc71'
}) => {
  // Validate and process data
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      [barDataKey]: Number(String(item[barDataKey]).replace(/[^0-9.-]+/g, '')) || 0,
      [lineDataKey]: Number(String(item[lineDataKey]).replace(/[^0-9.-]+/g, '')) || 0
    }));
  }, [data, barDataKey, lineDataKey]);

  // Calculate Y-axis domains
  const domains = useMemo(() => {
    if (!processedData.length) return { bar: [0, 0], line: [0, 0] };

    const barValues = processedData.map(item => item[barDataKey]);
    const lineValues = processedData.map(item => item[lineDataKey]);

    return {
      bar: [0, Math.max(...barValues) * 1.1], // Add 10% padding
      line: [Math.min(...lineValues) * 0.9, Math.max(...lineValues) * 1.1]
    };
  }, [processedData, barDataKey, lineDataKey]);

  // Handle empty state
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' 
              ? entry.value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })
              : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-md p-4">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="bar"
            orientation="left"
            domain={domains.bar}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="line"
            orientation="right"
            domain={domains.line}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey={barDataKey}
            fill={barColor}
            yAxisId="bar"
            name="Debit Amount"
            radius={[4, 4, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey={lineDataKey}
            stroke={lineColor}
            yAxisId="line"
            name="Balance"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineBarChart;