import React from "react";
import { Line, CartesianGrid, XAxis, YAxis, LineChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const SingleLineChart = ({
  data,
  title = "Line Chart",
  config = {},
  xAxis = { key: "month", tickFormatter: (value) => (typeof value === "string" ? value.slice(0, 3) : value) },
  yAxis = {
    key: "desktop",
    type: "line",
    color: "hsl(var(--chart-5))",
  },
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxis.key}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xAxis.tickFormatter}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              key={yAxis.key}
              dataKey={yAxis.key}
              type="natural"
              stroke={yAxis.color}
              strokeWidth={2}
              dot={{
                fill: yAxis.color,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SingleLineChart;
