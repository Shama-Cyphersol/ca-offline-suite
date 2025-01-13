import React from "react";
import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const SingleLineChart = ({
  data = [],
  title = "",
  config = {},
  xAxisKey = null,
  yAxisKey = null,
  selectedColumns = [],
}) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const xAxis = xAxisKey || columns[0];

  const getColor = (index) => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];
    return colors[index % colors.length];
  };

  const lines = selectedColumns.map((column, index) => ({
    key: column,
    color: getColor(index),
  }));

  // Simplified number formatting
  const formatYAxis = (value) => {
    return value.toLocaleString(); // This will add commas for thousands
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ChartContainer className="w-full h-full" config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxis}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  typeof value === "string" ? value.slice(0, 10) : value
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={formatYAxis}
                {...config.yAxis}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {lines.map((line) => (
                <Line
                  key={line.key}
                  dataKey={line.key}
                  type="natural"
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{
                    fill: line.color,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SingleLineChart;
