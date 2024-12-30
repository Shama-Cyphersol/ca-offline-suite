import React from 'react';
import { Card, CardContent } from "../ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, FileText, ClipboardList } from 'lucide-react';

// Icon Component
const MetricIcon = ({ type }) => {
  const iconProps = { className: "h-6 w-6 text-white" };
  switch (type) {
    case 'statements':
      return <ClipboardList {...iconProps} />;
    case 'reports':
      return <FileText {...iconProps} />;
    case 'timeSaved':
      return <Clock {...iconProps} />;
    default:
      return null;
  }
};

// Main Component
const StatsMetricCard = ({ 
  type,
  title = 'N/A',
  mainValue = 0,
  mainValueLabel = '',
  percentageChange = 0,
  breakdownData = [],
  bottomStats = [],
  chartData = [],
  chartType = 'line'
}) => {
  return (
    <Card className="w-full h-[450px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white overflow-hidden">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <MetricIcon type={type} />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <div className="flex items-center text-emerald-300 text-sm font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            {percentageChange > 0 ? '+' : ''}{percentageChange}%
          </div>
        </div>

        {/* Main Value */}
        <div className="mb-6">
          <div className="text-4xl font-bold mb-1">
            {mainValue.toLocaleString()}
          </div>
          <div className="text-sm text-blue-100">
            {mainValueLabel || (type === 'timeSaved' ? 'minutes' : `${type} generated`)}
          </div>
        </div>

        {/* Breakdown Data */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {breakdownData?.map((item, index) => (
            <div key={index} className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">{item.label}</div>
              <div className="font-semibold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData?.length > 0 && (
          <div className="h-40 mt-6">
            <ResponsiveContainer width="95%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: '#fff', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: '#fff', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#000'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#fff"
                    strokeWidth={2}
                    dot={{ fill: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: '#fff', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: '#fff', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#000'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="rgba(255,255,255,0.8)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {bottomStats?.map((item, index) => (
            <div key={index} className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">{item.label}</div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Default Props
StatsMetricCard.defaultProps = {
  title: 'Default Title',
  mainValue: 0,
  mainValueLabel: 'N/A',
  percentageChange: 0,
  breakdownData: [],
  bottomStats: [],
  chartData: [],
  chartType: 'line'
};

export default StatsMetricCard;
