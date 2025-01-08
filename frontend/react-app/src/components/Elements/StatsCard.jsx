import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock, FileText, ClipboardList } from "lucide-react";

const getCardStyles = (type) => {
  switch (type) {
    case "reports":
      return {
        background: `linear-gradient(135deg, #2D2665 0%, #4633B5 100%),
                    radial-gradient(circle at top right, rgba(115, 103, 240, 0.3) 0%, transparent 70%),
                    radial-gradient(circle at bottom left, rgba(50, 40, 120, 0.3) 0%, transparent 70%),
                    radial-gradient(circle at center, rgba(115, 103, 240, 0.1) 0%, transparent 50%)`,
        boxShadow: "0 8px 32px rgba(45, 38, 101, 0.25)",
      };
    case "statements":
      return {
        background: `linear-gradient(135deg, #003366 0%, #0056B3 100%),
                    radial-gradient(circle at top right, rgba(0, 150, 255, 0.3) 0%, transparent 70%),
                    radial-gradient(circle at bottom left, rgba(0, 80, 170, 0.3) 0%, transparent 70%),
                    radial-gradient(circle at center, rgba(0, 150, 255, 0.1) 0%, transparent 50%)`,
        boxShadow: "0 8px 32px rgba(0, 51, 102, 0.25)",
      };
    case "timeSaved":
      return {
        background: `linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%),
                    radial-gradient(circle at top right, rgba(99, 102, 241, 0.3) 0%, transparent 70%),
                    radial-gradient(circle at bottom left, rgba(30, 27, 75, 0.3) 0%, transparent 70%),
                    radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`,
        boxShadow: "0 8px 32px rgba(30, 27, 75, 0.25)",
      };
    default:
      return {};
  }
};

const MetricIcon = ({ type }) => {
  const iconProps = {
    className:
      "h-4 w-4 text-white transition-all duration-300 sm:h-5 sm:w-5 lg:h-6 lg:w-6",
  };
  switch (type) {
    case "statements":
      return <ClipboardList {...iconProps} />;
    case "reports":
      return <FileText {...iconProps} />;
    case "timeSaved":
      return <Clock {...iconProps} />;
    default:
      return null;
  }
};

const AnimatedPieChart = ({ data }) => {
  const COLORS = [
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.4)",
    "rgba(255, 255, 255, 0.2)",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          animationBegin={0}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          itemStyle={{ color: "#1E1B4B" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const StatsMetricCard = ({
  type,
  title = "N/A",
  mainValue = 0,
  mainValueLabel = "",
  percentageChange = 0,
  breakdownData = [],
  bottomStats = [],
  chartData = [],
  chartType = "line",
}) => {
  const cardStyles = getCardStyles(type);

  const pieData =
    type === "timeSaved"
      ? [
          { name: "Automated Tasks", value: 60 },
          { name: "Manual Tasks", value: 30 },
          { name: "Other", value: 10 },
        ]
      : [];

  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 border-0 rounded-xl relative backdrop-blur-xl"
      style={cardStyles}
    >
      <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
      <CardContent className="flex flex-col h-full p-6 gap-4 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm shadow-lg">
              <MetricIcon type={type} />
            </div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              {title}
            </h2>
          </div>
          <div className="flex items-center text-emerald-400 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            {percentageChange > 0 ? "+" : ""}
            {percentageChange}%
          </div>
        </div>

        {/* Main Value */}
        <div>
          <div className="text-4xl font-bold text-white tracking-tight">
            {mainValue.toLocaleString()}
          </div>
          <div className="text-sm text-white/80">
            {mainValueLabel ||
              (type === "timeSaved"
                ? "Minutes Saved"
                : type === "reports"
                ? "Reports Generated"
                : "Statements Processed")}
          </div>
        </div>

        {/* Chart */}
        <div className="h-44 w-full">
          {type === "timeSaved" ? (
            <AnimatedPieChart data={pieData} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255, 255, 255, 0.3)"
                    tick={{
                      fill: "rgba(255, 255, 255, 0.8)",
                      fontSize: "12px",
                    }}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.3)"
                    tick={{
                      fill: "rgba(255, 255, 255, 0.8)",
                      fontSize: "12px",
                    }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#fff", strokeWidth: 0 }}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.1)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255, 255, 255, 0.3)"
                    tick={{
                      fill: "rgba(255, 255, 255, 0.8)",
                      fontSize: "12px",
                    }}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.3)"
                    tick={{
                      fill: "rgba(255, 255, 255, 0.8)",
                      fontSize: "12px",
                    }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {bottomStats?.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/15"
            >
              <div className="text-sm text-white/80 mb-1">{item.label}</div>
              <div className="text-lg font-semibold text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsMetricCard;
