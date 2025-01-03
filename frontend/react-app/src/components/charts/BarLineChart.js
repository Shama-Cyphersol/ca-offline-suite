import React from "react";
import {
  Bar,
  Line,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const BarLineChart = ({
  data = [],
  title = "Dynamic Combined Chart",
  config = {},
  xAxisKey = null,
  // Optional: Specify which columns should be bars vs lines
  columnTypes = {}, // e.g., { revenue: 'bar', growth: 'line' }
}) => {
  // Get all columns from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // Determine numeric columns
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

  // Generate colors for visualization
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

  // Determine visualization type for each numeric column
  const visualizations = numericColumns
    .filter((col) => col !== xAxis)
    .map((column, index) => {
      // If type is specified in columnTypes, use that, otherwise alternate between bar and line
      const type = columnTypes[column] || (index % 2 === 0 ? "bar" : "line");
      return {
        key: column,
        type: type,
        color: getColor(index),
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ComposedChart
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
            <ChartLegend content={<ChartLegendContent />} />
            {visualizations.map((viz) =>
              viz.type === "bar" ? (
                <Bar
                  key={viz.key}
                  dataKey={viz.key}
                  fill={viz.color}
                  radius={4}
                  barSize={20}
                />
              ) : (
                <Line
                  key={viz.key}
                  dataKey={viz.key}
                  type="natural"
                  stroke={viz.color}
                  strokeWidth={2}
                  dot={{
                    fill: viz.color,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              )
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarLineChart;
