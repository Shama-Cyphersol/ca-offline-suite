import React from 'react';

const HorizontalBarGraph = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.debitAmount));

  return (
    <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between mb-4">
          <div className="text-sm font-medium text-gray-600">Description</div>
          <div className="text-sm font-medium text-gray-600">Debit Amount (₹)</div>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1/3 text-sm text-gray-600 truncate" title={item.description}>
                {item.description}
              </div>
              <div className="flex-1 relative h-8">
                <div className="absolute h-full w-full bg-gray-100 rounded" />
                <div
                  className="absolute h-full bg-purple-600 rounded transition-all duration-300"
                  style={{ width: `${(item.debitAmount / maxValue) * 100}%` }}
                />
                <div className="absolute right-0 h-full flex items-center px-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.debitAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalBarGraph;