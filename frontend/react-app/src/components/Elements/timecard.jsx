import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Info, Clock, TrendingUp } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  growth,
  metrics,
  stats
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    
    const updateCount = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [value]);

  return (
    <Card className="w-full max-w-xl bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-blue-600" />}
            {title || 'Metric'}
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </CardTitle>
          {growth && (
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {growth}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-b from-blue-500 to-blue-700">
          {/* Animated content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <div className="text-5xl font-bold mb-2 animate-fadeIn">
              {count.toLocaleString()}
            </div>
            <div className="text-sm opacity-90">{unit}</div>
          </div>
          
          {/* Wave animations */}
          <div className="absolute bottom-0 left-0 right-0 h-64">
            <div className="absolute bottom-0 left-0 right-0 h-24 animate-wave bg-white/15" />
            <div className="absolute bottom-0 left-0 right-0 h-32 animate-wave-slow bg-white/12" />
            <div className="absolute bottom-0 left-0 right-0 h-28 animate-wave-slower bg-white/10" />
          </div>
          
          {/* Time period metrics */}
          {metrics && (
            <div className="absolute bottom-0 left-0 right-0 bg-blue-800/30 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-4 p-4 text-white">
                {Object.entries(metrics).map(([period, value], index) => (
                  <div key={period} className={`text-center ${index === 1 ? 'border-x border-white/20' : ''}`}>
                    <div className="text-sm opacity-75">{period}</div>
                    <div className="font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(stats).map(([label, value]) => (
              <div key={label} className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-lg font-semibold text-blue-600">{value}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;