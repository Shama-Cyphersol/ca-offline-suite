"use client";

import React from "react";
import {
  Bar,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-5))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

export function HorizontalBarChart({
  data,
  title = "Combined Chart - Bar",
  config = chartConfig,
  xAxisKey = "month",
  yAxisKey = "desktop", // Change this if needed to the correct key for your data
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ComposedChart
            data={data}
            margin={{
              top: 16,
              right: 12,
              bottom: 16,
              left: 12,
            }}
            layout="vertical"
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={yAxisKey} type="number" hide />
            <YAxis
              dataKey={xAxisKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey={yAxisKey}
              fill={config.desktop.color}
              radius={4}
              barSize={40} // Increased bar width
            >
              <LabelList
                dataKey={yAxisKey}
                position="insideRight" // Place the label inside the bar
                offset={8}
                fontSize={14} // Adjust font size for readability
                className="fill-foreground" // Style the label color
              />
            </Bar>
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default HorizontalBarChart;
