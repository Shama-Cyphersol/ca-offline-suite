import React from "react";

const Statistics = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg py-6">
      {/* <h2 className="text-xl font-bold mb-4">Dashboard Statistics</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className=" bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-[#3498db] mb-2">
            {stats.totalReports}
          </div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-[#3498db] mb-2">
            {stats.monthlyReports}
          </div>
          <div className="text-sm text-gray-600">Monthly Reports</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold text-[#3498db] mb-2">
            {stats.totalStatements}
          </div>
          <div className="text-sm text-gray-600">Total Statements</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
