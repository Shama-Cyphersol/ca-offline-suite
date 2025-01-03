import React from 'react';
import { Bar, Line, ComposedChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../ui/chart';

const BarLineChart = ({
  data,
  title = "Combined Chart - Line & Bar",
  config = {},
  xAxis = { key: "month", tickFormatter: (value) => (typeof value === 'string' ? value.slice(0, 3) : value) },
  yAxis = [
    { key: "mobile", type: "bar", color: "hsl(var(--chart-5))" },
    { key: "desktop", type: "line", color: "hsl(var(--chart-3))" },
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
              tickFormatter={xAxis.tickFormatter || undefined} // Optional tick formatting
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {yAxis.map((yAxisItem) => (
              yAxisItem.type === "bar" ? (
                <Bar
                  key={yAxisItem.key}
                  dataKey={yAxisItem.key}
                  fill={yAxisItem.color}
                  radius={4}
                  barSize={20}
                />
              ) : (
                <Line
                  key={yAxisItem.key}
                  dataKey={yAxisItem.key}
                  type="natural"
                  stroke={yAxisItem.color}
                  strokeWidth={2}
                  dot={{
                    fill: yAxisItem.color,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              )
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarLineChart;
