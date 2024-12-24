import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const ReportChart = ({ chartData }) => {
  const [viewType, setViewType] = useState("daily");

  const data = viewType === "daily" ? chartData.daily : chartData.monthly;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl  font-semibold">Report Trends</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("monthly")}
            className={`px-4 py-2 rounded transition-colors
                ${
                  viewType === "monthly"
                    ? "bg-[#3498db] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setViewType("daily")}
            className={`px-4 py-2 rounded transition-colors
                ${
                  viewType === "daily"
                    ? "bg-[#3498db] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
          >
            Daily View
          </button>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={viewType === "daily" ? "#1abc9c" : "#3498db"}
              strokeWidth={2}
              dot={false}
              name={`${viewType === "daily" ? "Daily" : "Monthly"} Reports`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportChart;
