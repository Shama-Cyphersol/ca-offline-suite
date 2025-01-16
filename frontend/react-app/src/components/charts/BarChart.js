import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  // Legend,
  // Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const SingleBarChart = ({
  data = [],
  title = "",
  config = {},
  xAxisKey = null,
  yAxisKey = null,
  showLegends = false,
}) => {
  // Get all columns from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Determine numeric columns (similar to table component)
  const numericColumns = columns.filter((column) =>
    data.some((row) => {
      const value = String(row[column]);
      return !isNaN(parseFloat(value)) && !value.includes("-");
    })
  );

  // If xAxisKey is not provided, use the first non-numeric column as default
  const defaultXAxis =
    columns.find((col) => !numericColumns.includes(col)) || columns[0];
  const xAxis = xAxisKey || defaultXAxis;

  // Generate colors for bars
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

  // Create bar configurations for numeric columns
  const bars = numericColumns
    .filter((col) => col !== xAxis) // Exclude the x-axis column
    .map((column, index) => ({
      key: column,
      color: getColor(index),
    }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ChartContainer className="w-full h-full" config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <YAxis axisLine={false} tickLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {showLegends && <ChartLegend content={<ChartLegendContent />} />}
              {bars.map((bar) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  fill={bar.color}
                  radius={4}
                  barSize={30}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SingleBarChart;
