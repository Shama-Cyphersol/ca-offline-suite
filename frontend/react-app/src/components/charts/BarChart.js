"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const SingleBarChart = ({
  data,
  title = "Bar Chart - Single",
  config = {},
  xAxis = {
    key: "month",
    tickFormatter: (value) =>
      typeof value === "string" ? value.slice(0, 3) : value,
  },
  yAxis = [
    { key: "desktop", color: "hsl(var(--chart-3))" },
    { key: "mobile", color: "hsl(var(--chart-5))" },
  ],
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
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
            {yAxis.map((yAxisItem) => (
              <Bar
                key={yAxisItem.key}
                dataKey={yAxisItem.key}
                fill={yAxisItem.color}
                radius={4}
                barSize={30}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SingleBarChart;
