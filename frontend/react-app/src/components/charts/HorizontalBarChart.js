import React from "react";
import {
  Bar,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  // ChartTooltip,
  ChartTooltipContent,
  // ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const HorizontalBarChart = ({
  data = [],
  title = "Dynamic Horizontal Bar Chart",
  config = {},
  xAxisKey = null,
  yAxisKey = null,
}) => {
  // Extract all columns from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Determine numeric columns
  const numericColumns = columns.filter((column) =>
    data.some((row) => {
      const value = String(row[column]);
      return !isNaN(parseFloat(value)) && !value.includes("-");
    })
  );

  // If xAxisKey is not provided, use the first non-numeric column
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
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ComposedChart
            data={data}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              dataKey={xAxis}
              type="category"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 10) : value
              }
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={bar.color}
                radius={4}
                barSize={20}
              >
                <LabelList
                  dataKey={bar.key}
                  position="right" // Explicitly position the label outside
                  offset={10} // Adjust the spacing from the bar
                  fontSize={12}
                  className="fill-foreground" // Optional: Adjust label styling
                />
              </Bar>
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HorizontalBarChart;
