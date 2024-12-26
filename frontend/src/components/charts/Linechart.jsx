import React from "react";
import PropTypes from "prop-types";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineChart = ({ data, xKey, width, height }) => {
  // Automatically determine keys for lines (excluding xKey)
  const lineKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== xKey) : [];

  return (
    <div style={{ width: "100%", height: height || 300 }}>
      <ResponsiveContainer width={width || "100%"} height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lineKeys.map((key, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={key}
              stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xKey: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LineChart;


