import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SingleBarChart = ({ 
  data, 
  firstMetric = 'credit',
  secondMetric = 'debit',
  firstMetricColor = '#4CAF50',
  secondMetricColor = '#F44336',
  xAxisKey = 'month',
  title = 'Monthly Transaction Analysis',
}) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        <div className="w-full h-[700px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={firstMetric}
              fill={firstMetricColor}
              opacity={0.8}
              name={`${firstMetric.charAt(0).toUpperCase() + firstMetric.slice(1)} Transactions`}
            />
            <Bar
              dataKey={secondMetric}
              fill={secondMetricColor}
              opacity={0.8}
              name={`${secondMetric.charAt(0).toUpperCase() + secondMetric.slice(1)} Transactions`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SingleBarChart;