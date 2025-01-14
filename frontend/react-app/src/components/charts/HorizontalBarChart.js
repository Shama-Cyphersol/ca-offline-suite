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
  ResponsiveContainer,
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
  title = "",
  config = {},
  xAxisKey = "Description",
  yAxisKey = "Credit",
}) => {
  // Ensure valid keys are passed
  if (!xAxisKey || !yAxisKey) {
    console.error("xAxisKey and yAxisKey must be provided.");
    return null;
  }

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

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
              <ChartContainer className="w-full h-full" config={config}>
          <ResponsiveContainer width="100%" height="100%">
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
              dataKey={xAxisKey}
              type="category"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={0}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.substring(0, 9)}...` : value
              }
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey={yAxisKey} fill={getColor(0)} radius={4} barSize={20}>
              <LabelList
                dataKey={yAxisKey}
                position="right"
                offset={10}
                fontSize={12}
                className="fill-foreground"
              />
            </Bar>
          </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HorizontalBarChart;
