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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const BarLineChart = ({
  data,
  title = "Combined Chart - Line & Bar",
  config = {},
  xAxisKey = "month",
  yAxisKeys = [
    { key: "mobile", type: "bar", color: "hsl(var(--chart-3))" },
    { key: "desktop", type: "line", color: "hsl(var(--chart-5))" },
  ],
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 3) : value
              }
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {yAxisKeys.map((yAxis) =>
              yAxis.type === "bar" ? (
                <Bar
                  key={yAxis.key}
                  dataKey={yAxis.key}
                  fill={yAxis.color}
                  radius={4}
                  barSize={20}
                />
              ) : (
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
              )
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarLineChart;
